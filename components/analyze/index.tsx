"use client";

import { Questionnaire } from '@/types/api'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Analyze = ({ uploadId, questionnaire }: { uploadId: string, questionnaire: Questionnaire[] }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (uploadId && questionnaire.length > 0) {
            const analyzeData = async () => {
                try {
                    setLoading(true);
                    const res = await fetch('/api/analyse', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ uploadId, questionnaire }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        router.push(`/reports/${data.persist.reportId}`);
                    }
                } catch (error) {
                    setLoading(false);
                    console.error('Error analyzing data:', error);
                } finally {
                    setLoading(false);
                }
            };
            analyzeData();
        }
    }, [uploadId, questionnaire]);

    return (
        <div className="text-center text-lg font-medium">
            {loading ? 'Analyzing...' : (
                <div className="h-screen w-screen flex items-center justify-center text-3xl opacity-30">
                    Report successfully Analyzed 🎉
                </div>
            )}
        </div>
    )
}

export default Analyze
