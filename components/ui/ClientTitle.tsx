"use client";

import { useEffect } from "react";

export default function ClientTitle({ title }: { title: string }) {
    useEffect(() => {
        document.title = `${title} | تذكرتي`;
    }, [title]);

    return null;
}
