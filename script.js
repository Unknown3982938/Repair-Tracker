const SHEET_ID = "1ESU-NGsVNWwJ7Ui3REO5FFROdxQ8KkIDQhFYuQXvc-g";
const SHEET_GID = "0";

// Google Sheets JSON feed
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;

let rows = [];

async function loadData() {
    const res = await fetch(URL);
    const text = await res.text();

    // Clean Google weird response
    const json = JSON.parse(text.substring(47).slice(0, -2));

    rows = json.table.rows;
    console.log("Data loaded:", rows);
}

function searchJob() {
    const input = document.getElementById("jobInput").value.trim();

    const result = rows.find(r => {
        const jobId = r.c[0]?.v;
        return jobId === input;
    });

    const output = document.getElementById("output");

    if (!result) {
        output.innerHTML = "<p>❌ Job not found</p>";
        return;
    }

    const c = result.c;

    const data = {
        jobId: c[0]?.v,
        unitType: c[2]?.v,
        unitModel: c[3]?.v,
        issue: c[4]?.v,
        resolution: c[5]?.v,
        dateReceived: c[6]?.v,
        status: c[13]?.v,
        asOf: c[14]?.v,
        retrieved: c[15]?.v
    };

    output.innerHTML = `
        <div class="card">
            <h2>${data.jobId}</h2>

            <p><b>Device:</b> ${data.unitType} - ${data.unitModel}</p>
            <p><b>Issue:</b> ${data.issue}</p>
            <p><b>Resolution:</b> ${data.resolution || "Pending"}</p>
            <p><b>Status:</b> ${data.status}</p>
            <p><b>Date Received:</b> ${data.dateReceived}</p>
            <p><b>Last Update:</b> ${data.asOf}</p>
            <p><b>Retrieved:</b> ${data.retrieved || "-"}</p>
        </div>
    `;
}

loadData();
