"use client";

import Analyze from '@/components/analyze';
import Metrics from '@/components/metrics';
import { PreviewTable } from '@/components/table/previewTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Invoice, Questionnaire, uploadDocType } from '@/types/api';
import { File } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const Page = () => {
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [res, setRes] = useState<uploadDocType>({} as uploadDocType);
    const [loading, setLoading] = useState(false);

    const [questionnaire, setQuestionnaire] = useState<Questionnaire[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        setFile(selectedFile);
    }

    useEffect(() => {
        const handleFileUpload = async () => {
            try {
                setLoading(true);
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error(`Upload failed with status ${res.status}`);
                }

                const data = await res.json();
                const newProgress = progress + 50;
                setProgress(newProgress);
                setRes(data);
            } catch {
                toast("failed to upload file")
            } finally {
                setLoading(false);
            }
        };

        if (progress === 0 && file) {
            handleFileUpload();
        }
    }, [file, progress]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(res.uploadId);
            toast("Copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy:", err);
            toast("Failed to copy");
        }
    };

    return (
        <div className="p-5">
            <div className="w-screen max-w-xl min-w-sm mb-10">
                <div className='flex justify-between mb-2'>
                    {progress === 0 && (
                        loading ? (
                            <span>Uploading file...</span>
                        ) : (
                            <h1> Upload CSV/JSON</h1>
                        )
                    )}
                    {progress === 50 && (
                        <h1>Data Preview</h1>
                    )}
                    {progress === 75 && (
                        <h1>Analyze Metrics</h1>
                    )}
                    {progress === 100 && (
                        <h1>Analyzed Report</h1>
                    )}
                    {progress}%
                </div>
                <Progress value={progress} />
            </div>

            {progress === 0 && <div>
                <Label htmlFor="file" className="mb-1 opacity-70 flex">Choose a file to upload CSV/JSON <span className='text-red-500'>*</span></Label>
                <Input id="file" type="file" className='w-screen max-w-xl min-w-sm' onChange={handleFileChange} accept=".csv, .json" />
            </div>}

            {progress === 50 && (
                <div>
                    <h1 className="flex justify-start items-center gap-2 mb-3">Upload Id: {res.uploadId} <File size={16} onClick={handleCopy} /></h1>
                    <PreviewTable res={res.records as Invoice[]} />
                    <Button onClick={() => setProgress(75)} className='mt-5'>Add Analyze Metrics</Button>
                </div>
            )}

            {progress === 75 && (
                <div>
                    <Metrics questionnaire={questionnaire} setQuestionnaire={setQuestionnaire} />
                    <Button onClick={() => setProgress(100)} className='mt-5'>Analyze</Button>
                </div>
            )}

            {progress === 100 && (
                <Analyze uploadId={res.uploadId as string} questionnaire={questionnaire} />
            )}
        </div>
    )
}

export default Page
