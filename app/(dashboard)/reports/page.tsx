"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
    const [reports, setReports] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchReports = async () => {
            const res = await fetch("/api/reports", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                setReports(data.report);
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-4">
            {reports.map((report) => (
                <Card
                    key={report.reportId}
                    className="p-3 shadow-sm hover:shadow-md transition rounded-2xl"
                    onClick={() => router.push(`/reports/${report.reportId}`)}

                >
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold truncate">
                            Report ID: {report.reportId}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-sm text-gray-600 truncate">
                            <span className="font-medium text-gray-800">Created At: </span>
                            {moment(report.createdAt).format("MMMM Do YYYY") ?? "N/A"}
                        </div>

                        <div className="text-sm text-gray-600">
                            <span className="font-medium text-gray-800">Overall Score: </span>
                            <span
                                className={`font-semibold ${parseFloat(report?.Score?.overall || "0") >= 50
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {report?.Score?.overall ?? "0.00%"}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Page;
