/*
Type of action to broadcast.
Choose one, depending on what the user is about to receive: typing for text messages,
upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes,
upload_document for general files, choose_sticker for stickers, find_location for location data,
record_video_note or upload_video_note for video notes.

*/
export function autoChatAction() {
    // Create and return a transformer function.
    return async (prev, method, payload, signal) => {
        // Save the handle of the set interval so we can clear it later.
        let handle;
        // send document
        if (method === "sendDocument" && "chat_id" in payload) {
            // We now know that a document is being sent.
            const actionPayload = {
                chat_id: payload.chat_id,
                action: "upload_document",
            };
            // Repeatedly set the chat action while the file is being uploaded.
            handle ??= setInterval(() => {
                prev("sendChatAction", actionPayload).catch(console.error);
            }, 5000);
        }
        try {
            // Run the actual method from the bot.
            return await prev(method, payload, signal);
        }
        finally {
            // Clear the interval so we stop sending the chat action to the client.
            clearInterval(handle);
        }
    };
}
//# sourceMappingURL=chatActionPlugin.js.map