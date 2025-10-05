# schema structure and return type

- profile [login alone]
    - schema:
        ```json
        {
            "email": "string",
            "password": "string"
        }

    - returns:
        ```json
        {
            "message": "string",
            "status": "number"
        }
        ```

- Upload
    - schema: 
        ```json
        {
            "uploadId": "string", # generated using randomuuid
            "uploadedAt": "Date",
            "recordCount": "number",
            "data": []
        };
        ```
    - returns: 
        ```json
        {
            "message": "string",
            "insertedId": "objectId", # mongodb objectId
            "uploadId": "string",
            "recordCount": 4
        }
        ```

- analyse
    - Operates:
        ```json
        {
            "message": "Analysis complete",
            "data": {
                "total": {
                    "rule": "TOTALS_BALANCE",
                    "results": [
                        {
                            "invoice": "INV-2001",
                            "ok": true,
                            "expected": 112,
                            "got": 112,
                            "index": 1
                        }
                    ]
                },    
                "date": {
                    "rule": "DATE_ANOMALY",
                    "results": [
                        {
                            "invoice": "INV-2001",
                            "ok": true,
                            "expected": "YYYY-MM-DD | YYYY/MM/DD",
                            "got": "2025/01/10",
                            "index": 1
                        }
                    ]
                },
                "currency": {
                    "rule": "CURRENCY_ANOMALY",
                    "results": [
                        {
                        "invoice": "INV-2001",
                        "ok": false,
                        "expected": "AED | SAR | MYR | USD",
                        "got": "EURO",
                        "index": 1
                        },
                    ]
                },
                "nullAnomaly": {
                    "rule": "NULL_ANOMALY",
                    "results": [
                        {
                        "invoice": "INV-2001",
                        "ok": false,
                        "expected": {
                            "buyer_trn": "900900900",
                            "seller_trn": "ABC123"
                        },
                        "got": {
                            "buyer_trn": "900900900",
                            "seller_trn": "ABC123"
                        },
                        "index": 1
                        },
                    ]
                },
                "lineMath": {
                    "rule": "LINE_MATH",
                    "results": [
                        {
                            "invoice": "INV-2001",
                            "ok": true,
                            "expected": 100,
                            "got": 100,
                            "index": 1,
                            "lineIndex": 1
                        },
                    ]
                }
            }
        }
        ```

    - returns:
        ```json
            {
                "message": "string",
                "insertedId": "objectId",
                "reportId": "string",
            }
        ```

- Reports
    - schema:
        ```json
        {
            "reportId": "r_123",
            "scores": {
                "data": 0,
                "coverage": 0,
                "rules": 0,
                "posture": 0,
                "overall": 0
            },
            "coverage": {
                "matched": ["buyer.trn", "invoice.id"],
                "close": [
                { "target":"seller.trn", "candidate":"seller_tax_id", "confidence": 0.86 }
                ],
                "missing": ["invoice.currency"]
            },
            "ruleFindings": [
                { "rule":"TOTALS_BALANCE", "ok": true },
                { "rule":"LINE_MATH", "ok": false, "exampleLine": 2, "expected": 120, "got": 118 },
                { "rule":"DATE_ISO", "ok": true },
                { "rule":"CURRENCY_ALLOWED", "ok": false, "value": "EURO" },
                { "rule":"TRN_PRESENT", "ok": true }
            ],
            "gaps": ["Missing buyer.trn", "Invalid currency EURO"],
            "meta": {
                "rowsParsed": 120,
                "linesTotal": 320,
                "country": "UAE",
                "erp": "SAP",
                "db": "postgres"
            }
        }
        ```
