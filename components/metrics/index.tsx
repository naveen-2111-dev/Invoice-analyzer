import { Questionnaire } from '@/types/api'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react'

const Metrics = ({ questionnaire, setQuestionnaire }: { questionnaire: Questionnaire[], setQuestionnaire: React.Dispatch<React.SetStateAction<Questionnaire[]>> }) => {
    const handleChange = (index: number, key: keyof Questionnaire, value: string) => {
        setQuestionnaire(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [key]: value === "true"
            };
            return updated;
        });
    }

    return (
        <div className="flex gap-4 w-screen max-w-xl min-w-sm">
            <Select
                value={String(questionnaire[0]?.webhooks ?? "")}
                onValueChange={(val) => handleChange(0, "webhooks", val)}
            >
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Webhook" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Webhook</SelectLabel>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select
                value={String(questionnaire[1]?.sandbox_env ?? "")}
                onValueChange={(val) => handleChange(1, "sandbox_env", val)}
            >
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="sandbox_env" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>sandbox_env</SelectLabel>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select
                value={String(questionnaire[2]?.retries ?? "")}
                onValueChange={(val) => handleChange(2, "retries", val)}
            >
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="retries" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>retries</SelectLabel>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default Metrics
