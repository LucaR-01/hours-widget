(function() {
    // 1. Inject CSS for the floating widget
    const style = document.createElement("style");
    style.innerHTML = `
        #hours-checker-widget {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            background: #2f3d25 !important;
            color: #f4f4f4 !important;
            padding: 16px 20px !important;
            border-radius: 12px !important;
            max-width: 280px !important;
            box-shadow: 0 10px 15px rgba(0,0,0,0.3) !important;
            text-align: center !important;
            box-sizing: border-box !important;
            z-index: 999999 !important;
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
    `;
    document.head.appendChild(style);

    // 2. Create the HTML container
    const container = document.createElement("div");
    container.id = "hours-checker-widget";
    container.innerHTML = `
        <div class="hours-title">Are we open?</div>
        <div id="status-display" class="status-badge">Checking hours...</div>
    `;
    document.body.appendChild(container);

    // 3. Real Schedule Mapping (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const weeklySchedule = {
        0: { open: 12 * 60, close: 20 * 60, label: "12 PM - 8 PM" },   // Sunday
        1: { open: 12 * 60, close: (21 * 60) + 30, label: "12 PM - 9:30 PM" },    // Monday
        2: { open: 12 * 60, close: (21 * 60) + 30, label: "12 PM - 9:30 PM" },    // Tuesday
        3: { open: 12 * 60, close: (21 * 60) + 30, label: "12 PM - 9:30 PM" },    // Wednesday
        4: { open: 12 * 60, close: (21 * 60) + 30, label: "12 PM - 9:30 PM" },    // Thursday
        5: { open: 12 * 60, close: 22 * 60, label: "12 PM - 10 PM" },    // Friday
        6: { open: 12 * 60, close: 22 * 60, label: "12 PM - 10 PM" }     // Saturday
    };

    function updateOpeningStatus() {
        const now = new Date();
        const statusDisplay = document.getElementById("status-display");
        if (!statusDisplay) return;

        // Force time evaluation specifically in London time
        const londonTimeString = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Europe/London',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        }).format(now);

        const [hoursStr, minutesStr] = londonTimeString.split(':');
        const currentHours = parseInt(hoursStr, 10);
        const currentMinutesTotal = (currentHours * 60) + parseInt(minutesStr, 10);

        // Get accurate day in London timezone
        const londonDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
        const currentDay = londonDate.getDay();

        const todaySchedule = weeklySchedule[currentDay];

        // Check if open
        if (currentMinutesTotal >= todaySchedule.open && currentMinutesTotal <= todaySchedule.close) {
            statusDisplay.innerHTML = `🟢 Open Now • Closes at ${todaySchedule.label.split(' - ')[1]}`;
            statusDisplay.style.color = "#4ade80"; 
        } else {
            const tomorrowDay = (currentDay + 1) % 7;
            const tomorrowSchedule = weeklySchedule[tomorrowDay];
            
            statusDisplay.innerHTML = `🔴 Currently Closed • Tomorrow: ${tomorrowSchedule.label}`;
            statusDisplay.style.color = "#f87171"; 
        }
    }

    updateOpeningStatus();
    setInterval(updateOpeningStatus, 15000);
})();
