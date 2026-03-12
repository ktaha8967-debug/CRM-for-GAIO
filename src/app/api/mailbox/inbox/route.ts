import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import * as imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const gmailTokensCookie = cookieStore.get('gmail_tokens');
    
    // --- NATIVE GMAIL API FLOW ---
    if (gmailTokensCookie) {
      const tokens = JSON.parse(gmailTokensCookie.value);
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      oauth2Client.setCredentials(tokens);

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      
      const { labelId = 'INBOX' } = await req.json();

      const response = await gmail.users.messages.list({
        userId: 'me',
        labelIds: [labelId],
        maxResults: 25,
      });

      const messages = response.data.messages || [];
      const parsedMessages = await Promise.all(messages.map(async (m) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: m.id!,
          format: 'full',
        });

        const headers = detail.data.payload?.headers;
        const subject = headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers?.find(h => h.name === 'From')?.value || 'Unknown';
        const date = headers?.find(h => h.name === 'Date')?.value || '';
        const snippet = detail.data.snippet || '';
        const isRead = !detail.data.labelIds?.includes('UNREAD');
        const isStarred = detail.data.labelIds?.includes('STARRED');

        return {
          id: m.id,
          folder: labelId.toLowerCase(),
          sender: from,
          subject,
          preview: snippet,
          date: new Date(date).toLocaleDateString(),
          read: isRead,
          starred: isStarred,
          content: 'Full content available in detailed view',
          isGmail: true
        };
      }));

      return NextResponse.json(parsedMessages);
    }

    // --- LEGACY IMAP FLOW ---
    const body = await req.json();
    const { imapHost, imapPort, user, pass, labelId = 'INBOX' } = body;

    if (!imapHost || !user || !pass) {
      return NextResponse.json({ error: 'Please connect Gmail or configure IMAP' }, { status: 400 });
    }

    const config = {
      imap: {
        user,
        password: pass,
        host: imapHost,
        port: parseInt(imapPort) || 993,
        tls: true,
        authTimeout: 15000,
        connTimeout: 15000,
        tlsOptions: { rejectUnauthorized: false }
      },
    };

    const connection = await imaps.connect(config);
    
    // Map folder names for common providers
    let imapFolder = labelId;
    const hostLower = imapHost.toLowerCase();
    
    if (hostLower.includes('gmail.com')) {
      const gmailMapping: Record<string, string> = {
        'INBOX': 'INBOX',
        'STARRED': '[Gmail]/Starred',
        'SENT': '[Gmail]/Sent Mail',
        'TRASH': '[Gmail]/Trash',
        'SPAM': '[Gmail]/Spam',
        'DRAFT': '[Gmail]/Drafts'
      };
      imapFolder = gmailMapping[labelId] || labelId;
    } else if (hostLower.includes('outlook') || hostLower.includes('office365')) {
      const outlookMapping: Record<string, string> = {
        'INBOX': 'INBOX',
        'STARRED': 'Flagged',
        'SENT': 'Sent',
        'TRASH': 'Deleted',
        'SPAM': 'Junk',
        'DRAFT': 'Drafts'
      };
      imapFolder = outlookMapping[labelId] || labelId;
    } else {
      // General mapping for other IMAP servers
      const generalMapping: Record<string, string> = {
        'INBOX': 'INBOX',
        'SENT': 'Sent',
        'TRASH': 'Trash',
        'SPAM': 'Spam',
        'STARRED': 'Starred',
        'DRAFT': 'Drafts'
      };
      imapFolder = generalMapping[labelId] || labelId;
    }

    try {
      await connection.openBox(imapFolder);
    } catch (e) {
      console.warn(`Folder ${imapFolder} not found, falling back to INBOX`);
      await connection.openBox('INBOX');
    }

    const searchCriteria = ['ALL'];
    const fetchOptions = { bodies: [''], struct: true, markSeen: false };
    const messages = await connection.search(searchCriteria, fetchOptions);
    messages.sort((a, b) => b.attributes.uid - a.attributes.uid);
    
    const parsedMessages = await Promise.all(messages.slice(0, 25).map(async (msg) => {
      const allPart = msg.parts.find((p) => p.which === '');
      if (!allPart || !allPart.body) return null;
      const parsed = await simpleParser(allPart.body);
      return {
        id: msg.attributes.uid.toString(),
        folder: labelId.toLowerCase(),
        sender: parsed.from?.value[0]?.address || 'Unknown',
        subject: parsed.subject || 'No Subject',
        preview: parsed.text ? parsed.text.substring(0, 100) : '',
        date: parsed.date ? new Date(parsed.date).toLocaleDateString() : '',
        read: msg.attributes.flags.includes('\\Seen'),
        content: parsed.text || parsed.html || ''
      };
    }));

    connection.end();
    return NextResponse.json(parsedMessages.filter(m => m !== null));

  } catch (error: any) {
    console.error('Mail Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
