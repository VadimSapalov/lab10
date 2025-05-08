document.addEventListener('DOMContentLoaded', () => {
    const analyticsWidget = document.getElementById('analytics-widget');
    const analyticsBtn = document.getElementById('analytics-btn');
    const closeAnalyticsBtn = document.getElementById('close-analytics-btn');
    const startPipelineBtn = document.getElementById('start-pipeline-btn');
    const pipelineHistory = document.getElementById('pipeline-history');
    const searchInput = document.getElementById('search-input');
    let pipelineId = 1;
    let currentSort = { column: 'id', direction: 'asc' };
    let allRows = [];

    // Initialize user select dropdown
    const userSelect = document.getElementById('user-select');
    const users = ['Jane Smith', 'Steve Hong', 'Alex Wales', 'Lin Yan'];
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    });

    // Function to show analytics
    function showAnalytics() {
        analyticsWidget.style.display = 'block';
        updateAnalytics();
    }

    // Function to hide analytics
    function hideAnalytics() {
        analyticsWidget.style.display = 'none';
    }

    // Function to generate random duration between 1:30 and 10 minutes
    function getRandomDuration() {
        const minSeconds = 90; // 1:30 minutes
        const maxSeconds = 600; // 10 minutes
        const duration = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')} min`;
    }

    // Function to generate random branch name
    function getRandomBranch() {
        const branches = ['main', 'dev', 'test'];
        return branches[Math.floor(Math.random() * branches.length)];
    }

    // Function to show pipeline form
    function showPipelineForm() {
        const dialog = document.createElement('div');
        dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        dialog.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 class="text-xl font-bold mb-4">New Pipeline Entry</h3>
                <form id="pipeline-form">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="status">
                            Status
                        </label>
                        <select id="status" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                            <option value="">Select Status</option>
                            <option value="Success">Success</option>
                            <option value="Failure">Failure</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="branch">
                            Branch
                        </label>
                        <select id="branch" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                            <option value="">Select Branch</option>
                            <option value="main">main</option>
                            <option value="dev">dev</option>
                            <option value="test">test</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="user">
                            User
                        </label>
                        <select id="user" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                            <option value="">Select User</option>
                            ${users.map(user => `<option value="${user}">${user}</option>`).join('')}
                        </select>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button type="button" id="cancel-btn" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                            Add Entry
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(dialog);

        // Handle form submission
        const form = dialog.querySelector('#pipeline-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const status = document.getElementById('status').value;
            const branch = document.getElementById('branch').value;
            const user = document.getElementById('user').value;

            const statusIcon = status === 'Success' ? 
                '<i class="fas fa-check-circle text-green-400 mr-2"></i>' : 
                status === 'Failure' ? 
                '<i class="fas fa-times-circle text-red-400 mr-2"></i>' : 
                '<i class="fas fa-ban text-yellow-400 mr-2"></i>';

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="border px-4 py-2">${pipelineId++}</td>
                <td class="border px-4 py-2">${branch}</td>
                <td class="border px-4 py-2">${getRandomDuration()}</td>
                <td class="border px-4 py-2">${statusIcon}${status}</td>
                <td class="border px-4 py-2">${getRandomDate()}</td>
                <td class="border px-4 py-2">${user}</td>
            `;
            pipelineHistory.appendChild(newRow);
            allRows.push(newRow);

            // Re-sort after adding new row
            sortRows(currentSort.column, currentSort.direction);

            // Remove the dialog
            document.body.removeChild(dialog);
        });

        // Handle cancel button
        const cancelBtn = dialog.querySelector('#cancel-btn');
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });

        // Close dialog when clicking outside
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
    }

    // Set up event listeners
    analyticsBtn.onclick = showAnalytics;
    closeAnalyticsBtn.onclick = hideAnalytics;
    startPipelineBtn.onclick = showPipelineForm;

    // Close analytics when clicking outside
    document.addEventListener('click', (e) => {
        if (analyticsWidget.style.display === 'block' && 
            !analyticsWidget.contains(e.target) && 
            e.target !== analyticsBtn) {
            hideAnalytics();
        }
    });

    // Hide analytics widget initially
    hideAnalytics();

    // Function to generate random date within the last 7 days
    function getRandomDate() {
        const now = new Date();
        const randomDays = Math.floor(Math.random() * 7);
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const date = new Date(now);
        date.setDate(date.getDate() - randomDays);
        date.setHours(randomHours, randomMinutes);
        return date.toLocaleString();
    }

    // Sample data with random dates
    const sampleData = [
        { status: 'Success', user: 'Jane Smith', date: getRandomDate() },
        { status: 'Failure', user: 'Steve Hong', date: getRandomDate() },
        { status: 'Canceled', user: 'Alex Wales', date: getRandomDate() },
        { status: 'Success', user: 'Jane Smith', date: getRandomDate() },
        { status: 'Success', user: 'Steve Hong', date: getRandomDate() },
        { status: 'Failure', user: 'Alex Wales', date: getRandomDate() },
        { status: 'Canceled', user: 'Jane Smith', date: getRandomDate() },
        { status: 'Success', user: 'Steve Hong', date: getRandomDate() },
        { status: 'Failure', user: 'Alex Wales', date: getRandomDate() },
        { status: 'Success', user: 'Jane Smith', date: getRandomDate() },
        { status: 'Success', user: 'Lin Yan', date: getRandomDate() },
        { status: 'Failure', user: 'Lin Yan', date: getRandomDate() },
        { status: 'Canceled', user: 'Lin Yan', date: getRandomDate() },
        { status: 'Success', user: 'Jane Smith', date: getRandomDate() },
        { status: 'Failure', user: 'Steve Hong', date: getRandomDate() },
        { status: 'Success', user: 'Alex Wales', date: getRandomDate() },
        { status: 'Canceled', user: 'Lin Yan', date: getRandomDate() },
        { status: 'Success', user: 'Steve Hong', date: getRandomDate() },
        { status: 'Failure', user: 'Jane Smith', date: getRandomDate() },
        { status: 'Success', user: 'Alex Wales', date: getRandomDate() }
    ];

    // Function to sort rows
    function sortRows(column, direction) {
        const rows = Array.from(pipelineHistory.getElementsByTagName('tr'));
        rows.sort((a, b) => {
            const aValue = a.children[getColumnIndex(column)].textContent;
            const bValue = b.children[getColumnIndex(column)].textContent;
            
            if (column === 'id') {
                return direction === 'asc' ? 
                    parseInt(aValue) - parseInt(bValue) : 
                    parseInt(bValue) - parseInt(aValue);
            } else if (column === 'date') {
                return direction === 'asc' ? 
                    new Date(aValue) - new Date(bValue) : 
                    new Date(bValue) - new Date(aValue);
            } else if (column === 'duration') {
                const [aMin, aSec] = aValue.split(':').map(Number);
                const [bMin, bSec] = bValue.split(':').map(Number);
                const aTotal = aMin * 60 + aSec;
                const bTotal = bMin * 60 + bSec;
                return direction === 'asc' ? aTotal - bTotal : bTotal - aTotal;
            } else {
                return direction === 'asc' ? 
                    aValue.localeCompare(bValue) : 
                    bValue.localeCompare(aValue);
            }
        });

        // Clear and re-append sorted rows
        pipelineHistory.innerHTML = '';
        rows.forEach(row => pipelineHistory.appendChild(row));
    }

    // Function to get column index
    function getColumnIndex(column) {
        const columns = { id: 0, branch: 1, duration: 2, status: 3, date: 4, user: 5 };
        return columns[column];
    }

    // Function to update sort indicators
    function updateSortIndicators(column) {
        const headers = document.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            const icon = header.querySelector('i');
            if (header.dataset.sort === column) {
                icon.className = currentSort.direction === 'asc' ? 
                    'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1';
            } else {
                icon.className = 'fas fa-sort ml-1';
            }
        });
    }

    // Function to filter rows based on search input
    function filterRows(searchTerm) {
        const rows = Array.from(pipelineHistory.getElementsByTagName('tr'));
        const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
        
        rows.forEach(row => {
            const cells = Array.from(row.getElementsByTagName('td'));
            const rowText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');
            
            // Check if all search terms are found in the row
            const matches = searchTerms.every(term => {
                // Special handling for status search
                if (term === 'success' || term === 'failure' || term === 'canceled') {
                    return cells[3].textContent.toLowerCase().includes(term);
                }
                // Special handling for user search
                if (['jane', 'smith', 'steve', 'hong', 'alex', 'wales', 'lin', 'yan'].includes(term)) {
                    return cells[5].textContent.toLowerCase().includes(term);
                }
                // General search
                return rowText.includes(term);
            });

            // Show/hide row based on match
            row.style.display = matches ? '' : 'none';
        });

        // Update the "no results" message
        const visibleRows = rows.filter(row => row.style.display !== 'none');
        let noResultsMsg = document.getElementById('no-results-message');
        
        if (visibleRows.length === 0 && searchTerm) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('tr');
                noResultsMsg.id = 'no-results-message';
                noResultsMsg.innerHTML = `
                    <td colspan="4" class="border px-4 py-4 text-center text-gray-500">
                        <i class="fas fa-search mr-2"></i>No matching results found
                    </td>
                `;
                pipelineHistory.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Add search input handler with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterRows(e.target.value);
        }, 300); // 300ms debounce
    });

    // Add clear search button
    const searchContainer = searchInput.parentElement;
    const clearButton = document.createElement('button');
    clearButton.className = 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600';
    clearButton.innerHTML = '<i class="fas fa-times"></i>';
    clearButton.style.display = 'none';
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(clearButton);

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        filterRows('');
    });

    searchInput.addEventListener('input', (e) => {
        clearButton.style.display = e.target.value ? 'block' : 'none';
    });

    // Add search placeholder with examples
    searchInput.placeholder = 'Search by status, user, or date... (e.g., "success jane" or "canceled")';

    // Add click handlers for sorting
    document.querySelectorAll('th[data-sort]').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }
            updateSortIndicators(column);
            sortRows(column, currentSort.direction);
        });
    });

    // Add sample data to the table
    sampleData.forEach(entry => {
        const newRow = document.createElement('tr');
        const statusIcon = entry.status === 'Success' ? 
            '<i class="fas fa-check-circle text-green-400 mr-2"></i>' : 
            entry.status === 'Failure' ? 
            '<i class="fas fa-times-circle text-red-400 mr-2"></i>' : 
            '<i class="fas fa-ban text-yellow-400 mr-2"></i>';
        
        newRow.innerHTML = `
            <td class="border px-4 py-2">${pipelineId++}</td>
            <td class="border px-4 py-2">${getRandomBranch()}</td>
            <td class="border px-4 py-2">${getRandomDuration()}</td>
            <td class="border px-4 py-2">${statusIcon}${entry.status}</td>
            <td class="border px-4 py-2">${entry.date}</td>
            <td class="border px-4 py-2">${entry.user}</td>
        `;
        pipelineHistory.appendChild(newRow);
        allRows.push(newRow);
    });

    // Function to get all unique dates from pipeline entries
    function getAllPipelineDates() {
        const dates = new Set();
        const rows = pipelineHistory.getElementsByTagName('tr');
        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('td');
            if (cells.length >= 4) {
                const date = new Date(cells[4].textContent);
                dates.add(date.toLocaleDateString());
            }
        });
        return Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
    }

    // Function to format date for display
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Initialize activity chart for all users
    const ctx = document.getElementById('weekly-activity-chart').getContext('2d');
    const weeklyActivityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Overall Pipeline Activity',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.25)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });

    // Initialize user-specific activity chart
    const userCtx = document.getElementById('user-weekly-activity-chart').getContext('2d');
    const userWeeklyActivityChart = new Chart(userCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'User Pipeline Activity',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });

    // Initialize overall pie chart
    const overallPieCtx = document.getElementById('overall-pie-chart').getContext('2d');
    const overallPieChart = new Chart(overallPieCtx, {
        type: 'pie',
        data: {
            labels: ['Success', 'Failure', 'Canceled'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });

    // Initialize user pie chart
    const userPieCtx = document.getElementById('user-pie-chart').getContext('2d');
    const userPieChart = new Chart(userPieCtx, {
        type: 'pie',
        data: {
            labels: ['Success', 'Failure', 'Canceled'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });

    // Function to update analytics
    function updateAnalytics() {
        const rows = pipelineHistory.getElementsByTagName('tr');
        const statusCounts = { Success: 0, Failure: 0, Canceled: 0 };
        const userStats = {
            'Jane Smith': { Success: 0, Failure: 0, Canceled: 0 },
            'Steve Hong': { Success: 0, Failure: 0, Canceled: 0 },
            'Alex Wales': { Success: 0, Failure: 0, Canceled: 0 },
            'Lin Yan': { Success: 0, Failure: 0, Canceled: 0 }
        };

        // Get all unique dates from pipeline entries
        const allDates = getAllPipelineDates();
        const formattedDates = allDates.map(formatDate);

        // Count statuses and user stats
        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('td');
            if (cells.length >= 4) {
                const status = cells[3].textContent.trim();
                const user = cells[5].textContent.trim();
                statusCounts[status]++;
                if (userStats[user]) {
                    userStats[user][status]++;
                }
            }
        });

        // Update overall statistics
        document.getElementById('success-count').textContent = statusCounts.Success;
        document.getElementById('failed-count').textContent = statusCounts.Failure;
        document.getElementById('stopped-count').textContent = statusCounts.Canceled;

        // Update overall pie chart
        overallPieChart.data.datasets[0].data = [
            statusCounts.Success,
            statusCounts.Failure,
            statusCounts.Canceled
        ];
        overallPieChart.update();

        // Update activity chart for all users
        const activityData = new Array(allDates.length).fill(0);
        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('td');
            if (cells.length >= 4) {
                const date = new Date(cells[4].textContent);
                const dateStr = date.toLocaleDateString();
                const dayIndex = allDates.indexOf(dateStr);
                if (dayIndex !== -1) {
                    activityData[dayIndex]++;
                }
            }
        });

        // Update chart data
        weeklyActivityChart.data.labels = formattedDates;
        weeklyActivityChart.data.datasets[0].data = activityData;
        weeklyActivityChart.update();

        // Update user-specific analytics
        const userSelect = document.getElementById('user-select');
        const selectedUser = userSelect.value;
        
        if (selectedUser && userStats[selectedUser]) {
            // Update user statistics
            document.getElementById('user-success-count').textContent = userStats[selectedUser].Success;
            document.getElementById('user-failed-count').textContent = userStats[selectedUser].Failure;
            document.getElementById('user-stopped-count').textContent = userStats[selectedUser].Canceled;

            // Update user pie chart
            userPieChart.data.datasets[0].data = [
                userStats[selectedUser].Success,
                userStats[selectedUser].Failure,
                userStats[selectedUser].Canceled
            ];
            userPieChart.update();

            // Update user-specific activity chart
            const userActivityData = new Array(allDates.length).fill(0);
            Array.from(rows).forEach(row => {
                const cells = row.getElementsByTagName('td');
                if (cells.length >= 4) {
                    const date = new Date(cells[4].textContent);
                    const dateStr = date.toLocaleDateString();
                    const dayIndex = allDates.indexOf(dateStr);
                    const user = cells[5].textContent.trim();
                    if (dayIndex !== -1 && user === selectedUser) {
                        userActivityData[dayIndex]++;
                    }
                }
            });

            // Update user chart data
            userWeeklyActivityChart.data.labels = formattedDates;
            userWeeklyActivityChart.data.datasets[0].data = userActivityData;
            userWeeklyActivityChart.update();
        }
    }

    // Update user analytics when selection changes
    userSelect.addEventListener('change', updateAnalytics);
});
