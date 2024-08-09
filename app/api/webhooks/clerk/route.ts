import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local")
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {status: 400})
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400
        })
    } 

    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, fullName, emailAddresses, username, profileImageUrl } = payload.data;

        if (!emailAddresses || emailAddresses.length === 0) {
            return new Response("Error occurred -- user must have an email address", { status: 400 });
        }

        try {
            await db.user.create({
                data: {
                    name: fullName || 'anonymous',
                    email: emailAddresses[0].emailAddress,
                    username: username || 'unknown',
                    externalUserId: id,
                    imageUrl: profileImageUrl || ''
                }
            });
        } catch (error) {
            console.error("Error creating user:", error);
            console.log("Error creating user:", error);
            return new Response("Error occurred while creating user", { status: 500 });
        }
    }

    return new Response('', {status: 200})
}