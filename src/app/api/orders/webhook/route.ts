import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { orderId, amount, orderType, items } = body

        const botToken = process.env.TELEGRAM_BOT_TOKEN
        const chatId = process.env.TELEGRAM_CHAT_ID

        const itemsList = items.map((item: any) => `- ${item.name} (x${item.quantity})`).join('\n')
        const message = `🚀 *New Order Generated!*\n\n*Order ID:* \`${orderId.slice(0, 8).toUpperCase()}\`\n*Type:* ${orderType}\n*Total Amount:* $${Number(amount).toFixed(2)}\n\n*Items:*\n${itemsList}\n\n_This is a free automated notification._`

        if (botToken && chatId) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            })
        }

        console.log('--- AUTOMATED TELEGRAM NOTIFICATION ---')
        console.log('To Chat ID:', chatId)
        console.log('Message:', message)
        console.log('---------------------------------------')

        // IMPORTANT for USER:
        // To make this actually send a WhatsApp message, you need to call a WhatsApp API here.
        // For example, if using Twilio:
        /*
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'To': `whatsapp:${phone}`,
                'From': `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
                'Body': message
            })
        })
        */

        return NextResponse.json({ 
            success: true, 
            message: 'Webhook received and processed by server.',
            debug: { chatId, message }
        })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json({ success: false, error: 'Failed to process notification' }, { status: 500 })
    }
}
