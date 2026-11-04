import { useEffect } from "react";

import { useMessageStore } from "../store/messageStore";

export const useUnreadMessageCount = (): number => {
    const messages = useMessageStore((state) => state.messages);
    const loaded = useMessageStore((state) => state.loaded);
    const loading = useMessageStore((state) => state.loading);
    const loadMessages = useMessageStore((state) => state.loadMessages);

    useEffect(() => {
        if (!loaded && !loading) loadMessages();
    }, [loaded, loading, loadMessages]);

    return messages.filter((message) => !message.read_at).length;
};