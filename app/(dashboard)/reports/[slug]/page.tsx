"use client";

import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {
    const { slug } = useParams();
    return (
        <div>
            slug: {slug}
        </div>
    )
}

export default Page
