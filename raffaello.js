class BusinessHoursWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                #hours-checker-widget {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                    background: #2f3d25 !important;
                    color: #f4f4f4 !important;
                    padding: 16px 20px !important;
                    border-radius: 12px !important;
                    max-width: 280px !important;
                    box-shadow: 0 10px 15px rgba(0,0,0,0.3) !important;
                    text-align: center !important;
                    box-sizing: border-box !important;
                    border: 2px solid #f3e5ab !important;
                }
                .hours-title {
                    font-size: 15px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 1px !important;
                    color: #f3e5ab !important;
                    font-weight: bold !important;
                    margin-top: 0px !important;
                    margin-bottom: 15px !important;
                }
                .status-badge {
                    font-size: 14px !important;
                    font-weight: bold !important;
                    padding: 6px 10px !important;
                    border-radius: 6px !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    display: inline-block !important;
                }
            </style>
            <div id="hours-checker-widget">
                <div class="hours-title">Are we open?</div>
                <div id="status-display" class="status-badge">Checking hours...</div>
            </div>
        `;
    }

    connectedCallback() {
        const weeklySchedule = {
            0: { open: 12 * 60, close: 20 * 60, label: "12 PM - 8 PM" },
            1: { open: 12 * 60, close: (21 * 60) + 30, label: "12 PM - 9:30 PM" },
            2: { open: 12 * 60, close: (21 * 60) + 30, label: "12 PM - 9:30 PM" },
            3: { open: 12 * 60, close: (21 * 60) + 30, label: "12 PM - 9:30 PM" },
            4: { open: 12 * 60, close: (21 * 60) + 30, label: "12 PM - 9:30 PM" },
            5: { open: 12 * 60, close: 22 * 60, label: "12 PM - 10 PM" },
            6: { open: 12 * 60, close: 22 * 60, label: "12 PM - 10 PM" }
        };

        const updateOpeningStatus = () => {
            const now = new Date();
            const statusDisplay = this.shadowRoot.getElementById("status-display");
            if (!statusDisplay) return;

            const londonTimeString = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Europe/London',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
            }).format(now);

            const [hoursStr, minutesStr] = londonTimeString.split(':');
            const currentHours = parseInt(hoursStr, 10);
            const currentMinutesTotal = (currentHours * 60) + parseInt(minutesStr, 10);

            const londonDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
            const currentDay = londonDate.getDay();
            const todaySchedule = weeklySchedule[currentDay];

            if (currentMinutesTotal >= todaySchedule.open && currentMinutesTotal <= todaySchedule.close) {
                statusDisplay.innerHTML = `🟢 Open Now • Closes at ${todaySchedule.label.split(' - ')[1]}`;
                statusDisplay.style.color = "#4ade80";
            } else {
                const tomorrowDay = (currentDay + 1) % 7;
                const tomorrowSchedule = weeklySchedule[tomorrowDay];
                
                statusDisplay.innerHTML = `🔴 Currently Closed • Tomorrow: ${tomorrowSchedule.label}`;
                statusDisplay.style.color = "#f87171";
            }
        };

        updateOpeningStatus();
        this.interval = setInterval(updateOpeningStatus, 15000);
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }
}

customElements.define('business-hours-widget', BusinessHoursWidget);
