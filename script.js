// ==========================================================================
// QueueLess — Student Queue Management System
// script.js: Client-side Navigation, Authentication & Queue Management Logic
// ==========================================================================

// --------------------------------------------------------------------------
// 1. CONSTANTS & LOCAL STORAGE KEYS
// --------------------------------------------------------------------------
const STORAGE_KEYS = {
  USERS: 'ql_users',
  OFFICES: 'ql_offices',
  TICKETS: 'ql_tickets',
  NOTIFICATIONS: 'ql_notifications',
  SESSION: 'ql_session_user',
  COUNTERS: 'ql_ticket_counters'
};

const TICKET_STATUS = {
  WAITING: 'WAITING',
  CALLED: 'CALLED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// --------------------------------------------------------------------------
// 2. INITIAL SEED DATA
// --------------------------------------------------------------------------
const SEED_USERS = [
  {
    id: '2024-00001',
    username: '2024-00001',
    password: 'student',
    name: 'Maria Santos',
    email: '2024-00001@university.edu.ph',
    role: 'STUDENT',
    status: 'Active'
  },
  {
    id: 'STF-001',
    username: 'staff01',
    password: 'staff',
    name: 'Prof. Carlos Reyes',
    email: 'staff01@university.edu.ph',
    role: 'STAFF',
    assignedOffice: 'OFF-001',
    status: 'Active'
  },
  {
    id: 'ADM-001',
    username: 'admin01',
    password: 'admin',
    name: 'Dr. Evelyn Tan',
    email: 'admin01@university.edu.ph',
    role: 'ADMIN',
    assignedOffice: 'ALL',
    status: 'Active'
  }
];

const SEED_OFFICES = [
  {
    id: 'OFF-001',
    name: "Registrar's Office",
    desc: 'Enrollment, student records, certificates, and academic documents.',
    hours: '8:00 AM – 5:00 PM, Mon–Fri',
    location: 'Administration Building, Room 101',
    avgDuration: 10,
    status: 'OPEN',
    prefix: 'R'
  },
  {
    id: 'OFF-002',
    name: "Cashier's Office",
    desc: 'Tuition payments, fees, and authorized financial transactions.',
    hours: '8:00 AM – 4:00 PM, Mon–Fri',
    location: 'Administration Building, Ground Floor',
    avgDuration: 7,
    status: 'OPEN',
    prefix: 'C'
  },
  {
    id: 'OFF-003',
    name: 'University Clinic',
    desc: 'Basic health services, medical certificates, and student health assistance.',
    hours: '8:00 AM – 5:00 PM, Mon–Fri',
    location: 'Student Health Center, Room 105',
    avgDuration: 15,
    status: 'CLOSED',
    prefix: 'H'
  },
  {
    id: 'OFF-004',
    name: 'Information Technology Office',
    desc: 'IT support, student email accounts, and university system access.',
    hours: '8:00 AM – 5:00 PM, Mon–Fri',
    location: 'Technology Center, 2nd Floor',
    avgDuration: 10,
    status: 'OPEN',
    prefix: 'I'
  }
];

const SEED_TICKETS = [
  {
    id: 'TKT-001',
    ticketNumber: 'R-005',
    studentId: '2024-00001',
    studentName: 'Maria Santos',
    officeId: 'OFF-001',
    officeName: "Registrar's Office",
    serviceType: 'Certificate of Enrollment',
    status: TICKET_STATUS.COMPLETED,
    issuedAt: '2026-11-10T09:00:00+08:00',
    completedAt: '2026-11-10T09:18:00+08:00'
  },
  {
    id: 'TKT-002',
    ticketNumber: 'C-012',
    studentId: '2024-00001',
    studentName: 'Maria Santos',
    officeId: 'OFF-002',
    officeName: "Cashier's Office",
    serviceType: 'Tuition Payment',
    status: TICKET_STATUS.COMPLETED,
    issuedAt: '2026-11-08T10:15:00+08:00',
    completedAt: '2026-11-08T10:32:00+08:00'
  },
  {
    id: 'TKT-003',
    ticketNumber: 'R-022',
    studentId: '2024-00001',
    studentName: 'Maria Santos',
    officeId: 'OFF-001',
    officeName: "Registrar's Office",
    serviceType: 'Transcript Request',
    status: TICKET_STATUS.CANCELLED,
    issuedAt: '2026-11-05T13:30:00+08:00',
    completedAt: '2026-11-05T13:45:00+08:00'
  },
  {
    id: 'TKT-004',
    ticketNumber: 'R-014',
    studentId: '2024-00088',
    studentName: 'John Doe',
    officeId: 'OFF-001',
    officeName: "Registrar's Office",
    serviceType: 'Diploma Verification',
    status: TICKET_STATUS.CALLED,
    issuedAt: '2026-11-15T07:45:00+08:00',
    completedAt: null
  },
  {
    id: 'TKT-005',
    ticketNumber: 'R-015',
    studentId: '2024-00031',
    studentName: 'Jane Smith',
    officeId: 'OFF-001',
    officeName: "Registrar's Office",
    serviceType: 'Certificate of Enrollment',
    status: TICKET_STATUS.WAITING,
    issuedAt: '2026-11-15T07:55:00+08:00',
    completedAt: null
  },
  {
    id: 'TKT-006',
    ticketNumber: 'R-016',
    studentId: '2024-00045',
    studentName: 'Mark Lee',
    officeId: 'OFF-001',
    officeName: "Registrar's Office",
    serviceType: 'Grade Request',
    status: TICKET_STATUS.WAITING,
    issuedAt: '2026-11-15T08:02:00+08:00',
    completedAt: null
  },
  {
    id: 'TKT-007',
    ticketNumber: 'R-017',
    studentId: '2024-00012',
    studentName: 'Ana Reyes',
    officeId: 'OFF-001',
    officeName: "Registrar's Office",
    serviceType: 'Document Authentication',
    status: TICKET_STATUS.WAITING,
    issuedAt: '2026-11-15T08:10:00+08:00',
    completedAt: null
  }
];

const SEED_COUNTERS = {
  'OFF-001': 22,
  'OFF-002': 12,
  'OFF-003': 3,
  'OFF-004': 5
};

const SEED_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    userId: '2024-00001',
    title: 'Your Turn Is Approaching',
    body: 'You are now 2nd in line at the Registrar’s Office. Please prepare your documents.',
    type: 'info',
    time: '2026-11-15T09:00:00+08:00',
    read: false
  },
  {
    id: 'NOTIF-002',
    userId: '2024-00001',
    title: 'Ticket Completed',
    body: 'Your ticket C-012 at the Cashier’s Office has been marked as completed.',
    type: 'success',
    time: '2026-11-08T10:45:00+08:00',
    read: true
  },
  {
    id: 'NOTIF-003',
    userId: '2024-00001',
    title: 'Ticket Cancelled',
    body: 'Your ticket R-022 at the Registrar’s Office was cancelled.',
    type: 'danger',
    time: '2026-11-05T14:00:00+08:00',
    read: true
  }
];

// --------------------------------------------------------------------------
// 3. STORAGE & STATE MANAGEMENT
// --------------------------------------------------------------------------
let users = loadFromStorage(STORAGE_KEYS.USERS, SEED_USERS);
let offices = loadFromStorage(STORAGE_KEYS.OFFICES, SEED_OFFICES);
let tickets = loadFromStorage(STORAGE_KEYS.TICKETS, SEED_TICKETS);
let notifications = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
let counters = loadFromStorage(STORAGE_KEYS.COUNTERS, SEED_COUNTERS);
let currentUser = loadFromStorage(STORAGE_KEYS.SESSION, null);

// Temporary state for the Join Queue modal
let pendingQueueOfficeId = null;

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(offices));
  localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
  if (currentUser) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

// --------------------------------------------------------------------------
// 4. SCREEN & SECTION NAVIGATION
// --------------------------------------------------------------------------
function showScreen(screenId) {
  const screens = ['screen-login', 'screen-student', 'screen-staff', 'screen-admin'];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === screenId) {
      el.classList.remove('screen--hidden');
      el.classList.add('screen--active');
    } else {
      el.classList.remove('screen--active');
      el.classList.add('screen--hidden');
    }
  });

  // Close any mobile sidebars and overlay when switching screens
  document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('sidebar--open'));
  setSidebarOverlay(false);
}

// Show or hide the mobile sidebar backdrop overlay
function setSidebarOverlay(show) {
  const overlay = document.getElementById('sidebar-overlay');
  if (!overlay) return;
  if (show) {
    overlay.hidden = false;
    // Force reflow so the CSS animation triggers
    overlay.offsetHeight; // eslint-disable-line no-unused-expressions
    overlay.classList.add('overlay--active');
  } else {
    overlay.classList.remove('overlay--active');
    overlay.hidden = true;
  }
}

function navigateToSection(role, targetSectionId) {
  const mainId = `${role}-main`;
  const mainEl = document.getElementById(mainId);
  if (!mainEl) return;

  // Show only the target section
  const sections = mainEl.querySelectorAll('.dashboard-section');
  sections.forEach(sec => {
    if (sec.id === targetSectionId) {
      sec.classList.remove('section--hidden');
      sec.classList.add('section--active');
    } else {
      sec.classList.remove('section--active');
      sec.classList.add('section--hidden');
    }
  });

  // Update sidebar active state and read the button's label for the header title
  let selectedTitle = 'Dashboard';
  const sidebarNav = document.getElementById(`sidebar-${role}`);
  if (sidebarNav) {
    const buttons = sidebarNav.querySelectorAll('.sidebar-nav-btn');
    buttons.forEach(btn => {
      if (btn.dataset.target === targetSectionId) {
        btn.classList.add('sidebar-nav-btn--active');
        btn.setAttribute('aria-current', 'page');
        // Read only the button's direct text (strip whitespace), ignore child elements (badges)
        const rawText = Array.from(btn.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE)
          .map(n => n.textContent.trim())
          .filter(t => t.length > 0)
          .join(' ');
        if (rawText) selectedTitle = rawText;
      } else {
        btn.classList.remove('sidebar-nav-btn--active');
        btn.removeAttribute('aria-current');
      }
    });
  }

  // Update top header title (always replace, never append)
  const titleEl = document.getElementById(`${role}-section-title`);
  if (titleEl) titleEl.textContent = selectedTitle;

  // Close mobile sidebar and overlay
  if (sidebarNav) sidebarNav.classList.remove('sidebar--open');
  setSidebarOverlay(false);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --------------------------------------------------------------------------
// 5. AUTHENTICATION & SESSION
// --------------------------------------------------------------------------
function handleLogin(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const errorEl = document.getElementById('login-error');

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showLoginError('Please enter both username and password.');
    return;
  }

  const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

  if (!found) {
    showLoginError('Invalid Student ID / Username or Password.');
    return;
  }

  if (found.status === 'Inactive') {
    showLoginError('This account is currently deactivated.');
    return;
  }

  // Successful login
  errorEl.hidden = true;
  currentUser = found;
  saveToStorage();

  // Reset form
  document.getElementById('login-form').reset();

  // Route to the appropriate dashboard
  routeUserToDashboard(currentUser);
}

function showLoginError(msg) {
  const errorEl = document.getElementById('login-error');
  if (!errorEl) return;
  errorEl.textContent = msg;
  errorEl.hidden = false;
}

function handleLogout() {
  currentUser = null;
  saveToStorage();
  showScreen('screen-login');
}

function routeUserToDashboard(user) {
  if (!user) {
    showScreen('screen-login');
    return;
  }

  if (user.role === 'STUDENT') {
    setupStudentDashboard(user);
    showScreen('screen-student');
    navigateToSection('student', 'section-student-home');
  } else if (user.role === 'STAFF') {
    setupStaffDashboard(user);
    showScreen('screen-staff');
    navigateToSection('staff', 'section-staff-home');
  } else if (user.role === 'ADMIN') {
    setupAdminDashboard(user);
    showScreen('screen-admin');
    navigateToSection('admin', 'section-admin-home');
  }
}

// --------------------------------------------------------------------------
// 6. STUDENT DASHBOARD LOGIC
// --------------------------------------------------------------------------
function setupStudentDashboard(user) {
  // Update header and profile names
  const nameEl = document.getElementById('student-display-name');
  const welcomeEl = document.getElementById('student-welcome-name');
  const headerIdEl = document.getElementById('header-student-id');

  if (nameEl) nameEl.textContent = user.name;
  if (welcomeEl) welcomeEl.textContent = user.name;
  if (headerIdEl) headerIdEl.textContent = `ID: ${user.id}`;

  // Populate profile section
  const profId = document.getElementById('profile-student-id');
  const profName = document.getElementById('profile-full-name');
  const profEmail = document.getElementById('profile-email');

  if (profId) profId.textContent = user.id;
  if (profName) profName.textContent = user.name;
  if (profEmail) profEmail.textContent = user.email;

  renderStudentViews();
}

function renderStudentViews() {
  if (!currentUser) return;

  renderStudentOverviewStats();
  renderStudentHomeTicketCard();
  renderStudentOffices();
  renderStudentActiveTicket();
  renderStudentHistory();
  renderStudentNotifications();
}

// Check if student has an active ticket (WAITING or CALLED) in any or specific office
function getStudentActiveTicket(officeId = null) {
  return tickets.find(t => {
    const isStudent = t.studentId === currentUser.id;
    const isActive = t.status === TICKET_STATUS.WAITING || t.status === TICKET_STATUS.CALLED;
    return officeId ? isStudent && isActive && t.officeId === officeId : isStudent && isActive;
  });
}

function renderStudentOverviewStats() {
  const openOffices = offices.filter(o => o.status === 'OPEN').length;
  const activeTicket = getStudentActiveTicket();
  const completedCount = tickets.filter(t => t.studentId === currentUser.id && t.status === TICKET_STATUS.COMPLETED).length;

  const statOffices = document.getElementById('student-stat-offices');
  const statActive = document.getElementById('student-stat-active');
  const statCompleted = document.getElementById('student-stat-completed');

  if (statOffices) statOffices.textContent = openOffices;
  if (statActive) statActive.textContent = activeTicket ? 1 : 0;
  if (statCompleted) statCompleted.textContent = completedCount;
}

function renderStudentHomeTicketCard() {
  const noTicketBox = document.getElementById('student-home-no-ticket');
  const ticketCard = document.getElementById('student-home-ticket-card');
  const activeTicket = getStudentActiveTicket();

  if (!activeTicket) {
    if (noTicketBox) noTicketBox.hidden = false;
    if (ticketCard) ticketCard.hidden = true;
    return;
  }

  if (noTicketBox) noTicketBox.hidden = true;
  if (ticketCard) ticketCard.hidden = false;

  const numEl = document.getElementById('home-ticket-number');
  const offEl = document.getElementById('home-ticket-office');
  const statusEl = document.getElementById('home-ticket-status');
  const posEl = document.getElementById('home-ticket-position');
  const waitEl = document.getElementById('home-ticket-wait');

  if (numEl) numEl.textContent = activeTicket.ticketNumber;
  if (offEl) offEl.textContent = activeTicket.officeName;

  if (statusEl) {
    statusEl.textContent = activeTicket.status;
    statusEl.className = `ticket-status ticket-status--${activeTicket.status.toLowerCase()}`;
  }

  const waitingList = getOfficeWaitingTickets(activeTicket.officeId);
  const positionIndex = waitingList.findIndex(t => t.id === activeTicket.id);
  const position = positionIndex === -1 ? 1 : positionIndex + 1;
  const office = offices.find(o => o.id === activeTicket.officeId);
  const estWait = office ? (position - 1) * office.avgDuration : 0;

  if (posEl) posEl.textContent = activeTicket.status === TICKET_STATUS.CALLED ? 'Serving Now' : position;
  if (waitEl) waitEl.textContent = activeTicket.status === TICKET_STATUS.CALLED ? 'Proceed to Counter' : `~${estWait} min`;
}

function renderStudentOffices() {
  const grid = document.getElementById('student-office-grid');
  if (!grid) return;

  grid.innerHTML = offices.map(office => {
    const waitingCount = getOfficeWaitingTickets(office.id).length;
    const isOpen = office.status === 'OPEN';
    const activeForOffice = getStudentActiveTicket(office.id);

    return `
      <article class="office-card" role="listitem" data-office-id="${office.id}">
        <div class="office-card-icon" aria-hidden="true">&#127970;</div>
        <div class="office-card-body">
          <h4 class="office-card-name">${office.name}</h4>
          <p class="office-card-desc">${office.desc}</p>
          <dl class="office-card-meta">
            <dt>Hours</dt>
            <dd>${office.hours}</dd>
            <dt>Status</dt>
            <dd>
              <span class="office-status office-status--${office.status.toLowerCase()}">
                ${isOpen ? 'Open' : 'Closed'}
              </span>
            </dd>
            <dt>Waiting</dt>
            <dd id="waiting-${office.id}">${waitingCount} student${waitingCount === 1 ? '' : 's'}</dd>
          </dl>
        </div>
        <button
          type="button"
          class="btn-join-queue-card btn-primary"
          data-office-id="${office.id}"
          data-office-name="${office.name}"
          ${!isOpen || activeForOffice ? 'disabled' : ''}
          aria-label="Join queue for ${office.name}"
        >
          ${!isOpen ? 'Closed' : activeForOffice ? 'Already in Queue' : 'Join Queue'}
        </button>
      </article>
    `;
  }).join('');

  // Attach modal trigger listeners
  grid.querySelectorAll('.btn-join-queue-card').forEach(btn => {
    btn.addEventListener('click', () => {
      openJoinQueueModal(btn.dataset.officeId, btn.dataset.officeName);
    });
  });
}

function openJoinQueueModal(officeId, officeName) {
  pendingQueueOfficeId = officeId;
  const modal = document.getElementById('join-queue-modal');
  const nameEl = document.getElementById('modal-office-name');
  const ack = document.getElementById('modal-acknowledge');
  const serviceInput = document.getElementById('modal-service-type');

  if (nameEl) nameEl.textContent = officeName;
  if (ack) ack.checked = false;
  if (serviceInput) serviceInput.value = '';

  if (modal) modal.hidden = false;
}

function closeJoinQueueModal() {
  pendingQueueOfficeId = null;
  const modal = document.getElementById('join-queue-modal');
  if (modal) modal.hidden = true;
}

function handleConfirmJoinQueue() {
  if (!pendingQueueOfficeId || !currentUser) return;

  const office = offices.find(o => o.id === pendingQueueOfficeId);
  if (!office || office.status !== 'OPEN') {
    alert('This office is currently closed.');
    closeJoinQueueModal();
    return;
  }

  // Prevent multiple active tickets per office
  if (getStudentActiveTicket(office.id)) {
    alert(`You already have an active ticket for ${office.name}.`);
    closeJoinQueueModal();
    return;
  }

  const ack = document.getElementById('modal-acknowledge');
  if (ack && !ack.checked) {
    alert('Please acknowledge that the estimated waiting time is approximate.');
    return;
  }

  const serviceTypeInput = document.getElementById('modal-service-type');
  const serviceType = serviceTypeInput && serviceTypeInput.value.trim() ? serviceTypeInput.value.trim() : 'General Service';

  // Increment counter and generate ticket number
  if (!counters[office.id]) counters[office.id] = 0;
  counters[office.id]++;
  const prefix = office.prefix || 'T';
  const ticketNumber = `${prefix}-${String(counters[office.id]).padStart(3, '0')}`;

  const newTicket = {
    id: `TKT-${Date.now()}`,
    ticketNumber,
    studentId: currentUser.id,
    studentName: currentUser.name,
    officeId: office.id,
    officeName: office.name,
    serviceType,
    status: TICKET_STATUS.WAITING,
    issuedAt: new Date().toISOString(),
    completedAt: null
  };

  tickets.push(newTicket);

  // Add system notification
  addNotification({
    userId: currentUser.id,
    title: 'Successfully Joined a Queue',
    body: `You have joined the queue at ${office.name}. Your ticket number is ${ticketNumber}.`,
    type: 'success'
  });

  saveToStorage();
  closeJoinQueueModal();
  renderStudentViews();

  // Navigate directly to active ticket view
  navigateToSection('student', 'section-student-active-ticket');
}

function renderStudentActiveTicket() {
  const emptyBox = document.getElementById('active-ticket-empty');
  const cardBox = document.getElementById('active-ticket-card');
  const active = getStudentActiveTicket();

  if (!active) {
    if (emptyBox) emptyBox.hidden = false;
    if (cardBox) cardBox.hidden = true;
    return;
  }

  if (emptyBox) emptyBox.hidden = true;
  if (cardBox) cardBox.hidden = false;

  const numEl = document.getElementById('active-ticket-number');
  const statusEl = document.getElementById('active-ticket-status');
  const officeEl = document.getElementById('active-ticket-office');
  const serviceEl = document.getElementById('active-ticket-service');
  const issuedEl = document.getElementById('active-ticket-issued');
  const posEl = document.getElementById('active-ticket-position');
  const aheadEl = document.getElementById('active-ticket-ahead');
  const waitEl = document.getElementById('active-ticket-wait');
  const servingEl = document.getElementById('active-ticket-serving');

  if (numEl) numEl.textContent = active.ticketNumber;
  if (statusEl) {
    statusEl.textContent = active.status;
    statusEl.className = `ticket-status ticket-status--${active.status.toLowerCase()}`;
  }
  if (officeEl) officeEl.textContent = active.officeName;
  if (serviceEl) serviceEl.textContent = active.serviceType;
  if (issuedEl) {
    issuedEl.textContent = new Date(active.issuedAt).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });
    issuedEl.setAttribute('datetime', active.issuedAt);
  }

  const waitingTickets = getOfficeWaitingTickets(active.officeId);
  const positionIndex = waitingTickets.findIndex(t => t.id === active.id);
  const peopleAhead = positionIndex === -1 ? 0 : positionIndex;
  const office = offices.find(o => o.id === active.officeId);
  const estWait = office ? peopleAhead * office.avgDuration : 0;
  const currentlyCalled = getOfficeCalledTicket(active.officeId);

  if (posEl) posEl.textContent = active.status === TICKET_STATUS.CALLED ? 'Your turn!' : `Position ${peopleAhead + 1} in queue`;
  if (aheadEl) aheadEl.textContent = `${peopleAhead} student${peopleAhead === 1 ? '' : 's'} ahead`;
  if (waitEl) waitEl.textContent = active.status === TICKET_STATUS.CALLED ? 'Proceed to counter immediately' : `Approximately ${estWait} minutes`;
  if (servingEl) servingEl.textContent = currentlyCalled ? currentlyCalled.ticketNumber : 'None';

  const cancelBtn = document.getElementById('btn-cancel-active-ticket');
  if (cancelBtn) {
    cancelBtn.disabled = active.status !== TICKET_STATUS.WAITING;
    cancelBtn.onclick = () => handleStudentCancelTicket(active.id);
  }
}

function handleStudentCancelTicket(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket || ticket.status !== TICKET_STATUS.WAITING) return;

  if (!confirm(`Cancel ticket ${ticket.ticketNumber} at ${ticket.officeName}?`)) return;

  ticket.status = TICKET_STATUS.CANCELLED;
  ticket.completedAt = new Date().toISOString();

  addNotification({
    userId: currentUser.id,
    title: 'Ticket Cancelled',
    body: `Your ticket ${ticket.ticketNumber} at ${ticket.officeName} was cancelled.`,
    type: 'danger'
  });

  saveToStorage();
  renderStudentViews();
}

function renderStudentHistory() {
  const tbody = document.getElementById('student-history-tbody');
  const emptyEl = document.getElementById('student-history-empty');
  if (!tbody) return;

  const history = tickets.filter(t => t.studentId === currentUser.id && (t.status === TICKET_STATUS.COMPLETED || t.status === TICKET_STATUS.CANCELLED))
    .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));

  if (history.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#647587;">No past transactions found.</td></tr>';
    if (emptyEl) emptyEl.hidden = false;
    return;
  }

  if (emptyEl) emptyEl.hidden = true;

  tbody.innerHTML = history.map(t => `
    <tr>
      <td><strong>${t.ticketNumber}</strong></td>
      <td>${t.officeName}</td>
      <td><time datetime="${t.issuedAt}">${formatDate(t.issuedAt)}</time></td>
      <td><time datetime="${t.completedAt || t.issuedAt}">${formatDate(t.completedAt || t.issuedAt)}</time></td>
      <td><span class="ticket-status ticket-status--${t.status.toLowerCase()}">${t.status}</span></td>
    </tr>
  `).join('');
}

function renderStudentNotifications() {
  const list = document.getElementById('student-notification-list');
  const badge = document.getElementById('student-notif-badge');
  if (!list) return;

  const userNotifs = notifications.filter(n => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const unreadCount = userNotifs.filter(n => !n.read).length;
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }

  if (userNotifs.length === 0) {
    list.innerHTML = '<li class="empty-state"><p>No notifications yet.</p></li>';
    return;
  }

  list.innerHTML = userNotifs.map(n => `
    <li class="notification-item ${n.read ? 'notification-item--read' : 'notification-item--unread'} notification-item--${n.type}">
      <article>
        <div class="notification-item-header">
          <h4 class="notification-title">${n.title}</h4>
          ${!n.read ? '<span class="unread-dot" aria-label="Unread"></span>' : ''}
        </div>
        <p class="notification-body">${n.body}</p>
        <time class="notification-time" datetime="${n.time}">${formatDateTime(n.time)}</time>
      </article>
    </li>
  `).join('');
}

function handleMarkAllNotificationsRead() {
  if (!currentUser) return;
  notifications.forEach(n => {
    if (n.userId === currentUser.id) n.read = true;
  });
  saveToStorage();
  renderStudentNotifications();
}

function addNotification({ userId, title, body, type }) {
  const notif = {
    id: `NOTIF-${Date.now()}`,
    userId,
    title,
    body,
    type: type || 'info',
    time: new Date().toISOString(),
    read: false
  };
  notifications.unshift(notif);
}

// --------------------------------------------------------------------------
// 7. STAFF DASHBOARD LOGIC
// --------------------------------------------------------------------------
function setupStaffDashboard(user) {
  const nameEl = document.getElementById('staff-display-name');
  const welcomeName = document.getElementById('staff-welcome-name');
  const welcomeOffice = document.getElementById('staff-welcome-office');
  const headerOffice = document.getElementById('staff-header-office');

  const office = offices.find(o => o.id === user.assignedOffice) || offices[0];

  if (nameEl) nameEl.textContent = user.name;
  if (welcomeName) welcomeName.textContent = user.name;
  if (welcomeOffice) welcomeOffice.textContent = office.name;
  if (headerOffice) headerOffice.textContent = office.name;

  renderStaffViews(office);
}

function renderStaffViews(office) {
  const currentOffice = office || offices.find(o => o.id === currentUser.assignedOffice) || offices[0];

  const waitingTickets = getOfficeWaitingTickets(currentOffice.id);
  const calledTicket = getOfficeCalledTicket(currentOffice.id);
  const completedToday = tickets.filter(t => t.officeId === currentOffice.id && t.status === TICKET_STATUS.COMPLETED).length;

  // Home stats
  const statWaiting = document.getElementById('staff-stat-waiting');
  const statServing = document.getElementById('staff-stat-serving');
  const statCompleted = document.getElementById('staff-stat-completed');

  if (statWaiting) statWaiting.textContent = waitingTickets.length;
  if (statServing) statServing.textContent = calledTicket ? calledTicket.ticketNumber : 'None';
  if (statCompleted) statCompleted.textContent = completedToday;

  // Manage Queue Table
  const queueTbody = document.getElementById('staff-queue-tbody');
  if (queueTbody) {
    const queueList = [];
    if (calledTicket) queueList.push(calledTicket);
    queueList.push(...waitingTickets);

    if (queueList.length === 0) {
      queueTbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#647587;">No active tickets in this queue.</td></tr>';
    } else {
      queueTbody.innerHTML = queueList.map(t => {
        const isCalled = t.status === TICKET_STATUS.CALLED;
        return `
          <tr>
            <td><strong>${t.ticketNumber}</strong></td>
            <td>${t.studentId}</td>
            <td>${t.serviceType}</td>
            <td><time datetime="${t.issuedAt}">${formatTime(t.issuedAt)}</time></td>
            <td><span class="ticket-status ticket-status--${t.status.toLowerCase()}">${t.status}</span></td>
            <td>
              ${isCalled ? `
                <button type="button" class="btn-table-action btn-success-sm" data-action="complete" data-ticket-id="${t.id}">
                  Complete
                </button>
              ` : `
                <button type="button" class="btn-table-action btn-primary-sm" data-action="call" data-ticket-id="${t.id}">
                  Call
                </button>
              `}
            </td>
          </tr>
        `;
      }).join('');

      // Wire inline table action buttons
      queueTbody.querySelectorAll('.btn-table-action').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          const tid = btn.dataset.ticketId;
          if (action === 'call') {
            callSpecificTicket(tid);
          } else if (action === 'complete') {
            handleStaffCompleteTicket(currentOffice.id);
          }
        });
      });
    }
  }

  // Staff History Table
  const historyTbody = document.getElementById('staff-history-tbody');
  if (historyTbody) {
    const staffHistory = tickets.filter(t => t.officeId === currentOffice.id && (t.status === TICKET_STATUS.COMPLETED || t.status === TICKET_STATUS.CANCELLED))
      .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));

    if (staffHistory.length === 0) {
      historyTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#647587;">No completed transactions today.</td></tr>';
    } else {
      historyTbody.innerHTML = staffHistory.map(t => `
        <tr>
          <td><strong>${t.ticketNumber}</strong></td>
          <td>${t.studentId}</td>
          <td>${t.serviceType}</td>
          <td><time datetime="${t.issuedAt}">${formatDate(t.issuedAt)}</time></td>
          <td><span class="ticket-status ticket-status--${t.status.toLowerCase()}">${t.status}</span></td>
        </tr>
      `).join('');
    }
  }

  // Office Info tab
  const nameEl = document.getElementById('office-info-name');
  const descEl = document.getElementById('office-info-desc');
  const hoursEl = document.getElementById('office-info-hours');
  const locEl = document.getElementById('office-info-location');
  const avgEl = document.getElementById('office-info-avg');
  const statusEl = document.getElementById('office-info-status');

  if (nameEl) nameEl.textContent = currentOffice.name;
  if (descEl) descEl.textContent = currentOffice.desc;
  if (hoursEl) hoursEl.textContent = currentOffice.hours;
  if (locEl) locEl.textContent = currentOffice.location;
  if (avgEl) avgEl.textContent = `Approximately ${currentOffice.avgDuration} minutes per transaction`;
  if (statusEl) {
    statusEl.textContent = currentOffice.status === 'OPEN' ? 'Open' : 'Closed';
    statusEl.className = `office-status office-status--${currentOffice.status.toLowerCase()}`;
  }
}

function handleStaffCallNext(officeId) {
  const currentCalled = getOfficeCalledTicket(officeId);
  if (currentCalled) {
    alert(`Ticket ${currentCalled.ticketNumber} is currently called.\nPlease complete or skip it before calling the next student.`);
    return;
  }

  const waiting = getOfficeWaitingTickets(officeId);
  if (waiting.length === 0) {
    alert('There are no waiting students in the queue.');
    return;
  }

  const nextTicket = waiting[0];
  nextTicket.status = TICKET_STATUS.CALLED;

  addNotification({
    userId: nextTicket.studentId,
    title: 'Your Ticket Has Been Called!',
    body: `Ticket ${nextTicket.ticketNumber} has been called. Please proceed to the service counter immediately.`,
    type: 'alert'
  });

  saveToStorage();
  renderStaffViews();
}

function callSpecificTicket(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket || ticket.status !== TICKET_STATUS.WAITING) return;

  const currentCalled = getOfficeCalledTicket(ticket.officeId);
  if (currentCalled) {
    alert(`Ticket ${currentCalled.ticketNumber} is currently being served.\nPlease complete or skip it first.`);
    return;
  }

  ticket.status = TICKET_STATUS.CALLED;

  addNotification({
    userId: ticket.studentId,
    title: 'Your Ticket Has Been Called!',
    body: `Ticket ${ticket.ticketNumber} has been called. Please proceed to the counter.`,
    type: 'alert'
  });

  saveToStorage();
  renderStaffViews();
}

function handleStaffCompleteTicket(officeId) {
  const called = getOfficeCalledTicket(officeId);
  if (!called) {
    alert('No ticket is currently called.');
    return;
  }

  called.status = TICKET_STATUS.COMPLETED;
  called.completedAt = new Date().toISOString();

  addNotification({
    userId: called.studentId,
    title: 'Ticket Completed',
    body: `Your ticket ${called.ticketNumber} at ${called.officeName} was completed. Thank you!`,
    type: 'success'
  });

  saveToStorage();
  renderStaffViews();
}

function handleStaffSkipTicket(officeId) {
  const called = getOfficeCalledTicket(officeId);
  if (!called) {
    alert('No ticket is currently called to skip.');
    return;
  }

  if (!confirm(`Cancel / Skip ticket ${called.ticketNumber}?`)) return;

  called.status = TICKET_STATUS.CANCELLED;
  called.completedAt = new Date().toISOString();

  addNotification({
    userId: called.studentId,
    title: 'Ticket Cancelled by Staff',
    body: `Your ticket ${called.ticketNumber} was skipped or cancelled by office staff.`,
    type: 'danger'
  });

  saveToStorage();
  renderStaffViews();
}

// --------------------------------------------------------------------------
// 8. ADMINISTRATOR DASHBOARD LOGIC
// --------------------------------------------------------------------------
function setupAdminDashboard(user) {
  const nameEl = document.getElementById('admin-display-name');
  if (nameEl) nameEl.textContent = user.name;
  renderAdminViews();
}

function renderAdminViews() {
  renderAdminOverviewStats();
  renderAdminOfficeTable();
  renderAdminUserTable();
  renderAdminTransactionsTable();
  renderAdminReports();
}

function renderAdminOverviewStats() {
  const activeTicketsCount = tickets.filter(t => t.status === TICKET_STATUS.WAITING || t.status === TICKET_STATUS.CALLED).length;
  const completedCount = tickets.filter(t => t.status === TICKET_STATUS.COMPLETED).length;

  const statUsers = document.getElementById('admin-stat-users');
  const statOffices = document.getElementById('admin-stat-offices');
  const statActive = document.getElementById('admin-stat-active');
  const statCompleted = document.getElementById('admin-stat-completed');

  if (statUsers) statUsers.textContent = users.length;
  if (statOffices) statOffices.textContent = offices.length;
  if (statActive) statActive.textContent = activeTicketsCount;
  if (statCompleted) statCompleted.textContent = completedCount;
}

function renderAdminOfficeTable() {
  const tbody = document.getElementById('admin-offices-tbody');
  if (!tbody) return;

  tbody.innerHTML = offices.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.name}</td>
      <td>${o.desc}</td>
      <td>${o.hours}</td>
      <td>
        <span class="office-status office-status--${o.status.toLowerCase()}">
          ${o.status === 'OPEN' ? 'Open' : 'Closed'}
        </span>
      </td>
      <td class="table-actions">
        <button type="button" class="btn-table-action btn-primary-sm" data-action="toggle-office" data-id="${o.id}">
          ${o.status === 'OPEN' ? 'Set Closed' : 'Set Open'}
        </button>
        <button type="button" class="btn-table-action btn-danger-sm" data-action="delete-office" data-id="${o.id}">
          Delete
        </button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.btn-table-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const officeId = btn.dataset.id;
      if (action === 'toggle-office') {
        toggleOfficeStatus(officeId);
      } else if (action === 'delete-office') {
        deleteOffice(officeId);
      }
    });
  });
}

function toggleOfficeStatus(officeId) {
  const office = offices.find(o => o.id === officeId);
  if (!office) return;
  office.status = office.status === 'OPEN' ? 'CLOSED' : 'OPEN';
  saveToStorage();
  renderAdminViews();
}

function deleteOffice(officeId) {
  const activeTickets = tickets.filter(t => t.officeId === officeId && (t.status === TICKET_STATUS.WAITING || t.status === TICKET_STATUS.CALLED));
  if (activeTickets.length > 0) {
    alert('Cannot delete office while there are active tickets in its queue.');
    return;
  }
  if (!confirm('Are you sure you want to delete this office?')) return;
  offices = offices.filter(o => o.id !== officeId);
  saveToStorage();
  renderAdminViews();
}

function handleAddOffice(e) {
  e.preventDefault();
  const name = document.getElementById('new-office-name').value.trim();
  const desc = document.getElementById('new-office-desc').value.trim();
  const hours = document.getElementById('new-office-hours').value.trim();
  const avg = parseInt(document.getElementById('new-office-avg').value, 10);
  const status = document.getElementById('new-office-status').value;

  if (!name || !desc || !hours || !status || isNaN(avg) || avg < 1) {
    alert('Please fill out all required office fields.');
    return;
  }

  const newId = `OFF-${String(offices.length + 1).padStart(3, '0')}`;
  const prefix = name.charAt(0).toUpperCase();

  offices.push({
    id: newId,
    name,
    desc,
    hours,
    location: 'Campus Building',
    avgDuration: avg,
    status,
    prefix
  });

  saveToStorage();
  document.getElementById('add-office-form').reset();
  document.getElementById('add-office-form-container').hidden = true;
  renderAdminViews();
}

function renderAdminUserTable() {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;

  tbody.innerHTML = users.map(u => `
    <tr>
      <td><strong>${u.id}</strong></td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td><span class="role-badge role-badge--${u.role.toLowerCase()}">${u.role}</span></td>
      <td>
        <span class="account-status ${u.status === 'Active' ? 'account-status--active' : 'account-status--inactive'}">
          ${u.status}
        </span>
      </td>
      <td class="table-actions">
        <button type="button" class="btn-table-action btn-danger-sm" data-action="toggle-user" data-id="${u.id}">
          ${u.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.btn-table-action').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleUserStatus(btn.dataset.id);
    });
  });
}

function toggleUserStatus(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  if (user.id === currentUser.id) {
    alert('You cannot deactivate your own account.');
    return;
  }
  user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  saveToStorage();
  renderAdminUserTable();
}

function handleAddUser(e) {
  e.preventDefault();
  const name = document.getElementById('new-user-name').value.trim();
  const userId = document.getElementById('new-user-id').value.trim();
  const email = document.getElementById('new-user-email').value.trim();
  const role = document.getElementById('new-user-role').value;
  const assignedOffice = document.getElementById('new-user-office').value;

  if (!name || !userId || !email || !role) {
    alert('Please complete all required fields.');
    return;
  }

  if (users.find(u => u.id === userId || u.username.toLowerCase() === userId.toLowerCase())) {
    alert('A user with this ID or username already exists.');
    return;
  }

  users.push({
    id: userId,
    username: userId,
    password: role.toLowerCase(), // default password equals role name
    name,
    email,
    role,
    assignedOffice: assignedOffice || 'OFF-001',
    status: 'Active'
  });

  saveToStorage();
  document.getElementById('add-user-form').reset();
  document.getElementById('add-user-form-container').hidden = true;
  renderAdminViews();
}

function renderAdminTransactionsTable() {
  const tbody = document.getElementById('admin-transactions-tbody');
  if (!tbody) return;

  const allSorted = [...tickets].sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));

  tbody.innerHTML = allSorted.map(t => `
    <tr>
      <td><strong>${t.ticketNumber}</strong></td>
      <td>${t.studentId}</td>
      <td>${t.officeName}</td>
      <td>${t.serviceType}</td>
      <td><time datetime="${t.issuedAt}">${formatDate(t.issuedAt)}</time></td>
      <td><span class="ticket-status ticket-status--${t.status.toLowerCase()}">${t.status}</span></td>
    </tr>
  `).join('');
}

function renderAdminReports() {
  const total = tickets.length;
  const completed = tickets.filter(t => t.status === TICKET_STATUS.COMPLETED).length;
  const cancelled = tickets.filter(t => t.status === TICKET_STATUS.CANCELLED).length;

  // Find most used office
  const officeUsage = {};
  tickets.forEach(t => {
    officeUsage[t.officeName] = (officeUsage[t.officeName] || 0) + 1;
  });
  let mostUsed = 'N/A';
  let maxCount = 0;
  for (const [name, count] of Object.entries(officeUsage)) {
    if (count > maxCount) {
      maxCount = count;
      mostUsed = name.replace("Office", "").trim();
    }
  }

  const statTotal = document.getElementById('report-stat-total');
  const statComp = document.getElementById('report-stat-completed');
  const statCanc = document.getElementById('report-stat-cancelled');
  const topOffice = document.getElementById('report-top-office');

  if (statTotal) statTotal.textContent = total;
  if (statComp) statComp.textContent = completed;
  if (statCanc) statCanc.textContent = cancelled;
  if (topOffice) topOffice.textContent = mostUsed;

  // Activity breakdown table
  const tbody = document.querySelector('#report-activity-table tbody');
  if (!tbody) return;

  tbody.innerHTML = offices.map(o => {
    const issued = tickets.filter(t => t.officeId === o.id).length;
    const comp = tickets.filter(t => t.officeId === o.id && t.status === TICKET_STATUS.COMPLETED).length;
    const canc = tickets.filter(t => t.officeId === o.id && t.status === TICKET_STATUS.CANCELLED).length;
    const wait = tickets.filter(t => t.officeId === o.id && t.status === TICKET_STATUS.WAITING).length;

    return `
      <tr>
        <td><strong>${o.name}</strong></td>
        <td>${issued}</td>
        <td>${comp}</td>
        <td>${canc}</td>
        <td>${wait}</td>
      </tr>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 9. QUEUE HELPER FUNCTIONS
// --------------------------------------------------------------------------
function getOfficeWaitingTickets(officeId) {
  return tickets
    .filter(t => t.officeId === officeId && t.status === TICKET_STATUS.WAITING)
    .sort((a, b) => new Date(a.issuedAt) - new Date(b.issuedAt));
}

function getOfficeCalledTicket(officeId) {
  return tickets.find(t => t.officeId === officeId && t.status === TICKET_STATUS.CALLED) || null;
}

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function formatTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
  });
}

// --------------------------------------------------------------------------
// 10. EVENT LISTENERS INITIALIZATION
// --------------------------------------------------------------------------
function initEventListeners() {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Password visibility toggle
  const togglePassBtn = document.getElementById('toggle-password');
  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
      const passInput = document.getElementById('login-password');
      if (passInput) {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        togglePassBtn.textContent = isPass ? 'Hide' : 'Show';
      }
    });
  }

  // Logout buttons across all dashboards
  ['btn-logout-student', 'btn-logout-staff', 'btn-logout-admin'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handleLogout);
  });

  // Global delegation for sidebar and quick action buttons with data-target
  document.addEventListener('click', e => {
    const targetBtn = e.target.closest('[data-target]');
    if (targetBtn && targetBtn.dataset.target) {
      const role = targetBtn.dataset.screen || (currentUser ? currentUser.role.toLowerCase() : 'student');
      navigateToSection(role, targetBtn.dataset.target);
    }
  });

  // Mobile sidebar toggles with overlay backdrop
  ['student', 'staff', 'admin'].forEach(role => {
    const toggleBtn = document.getElementById(`btn-toggle-sidebar-${role}`);
    const sidebar = document.getElementById(`sidebar-${role}`);
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('sidebar--open');
        setSidebarOverlay(isOpen);
      });
    }
  });

  // Clicking the overlay closes the sidebar
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('sidebar--open'));
      setSidebarOverlay(false);
    });
  }

  // Join Queue Modal actions
  const confirmJoinBtn = document.getElementById('btn-confirm-join');
  if (confirmJoinBtn) confirmJoinBtn.addEventListener('click', handleConfirmJoinQueue);

  const cancelModalBtn = document.getElementById('btn-cancel-modal');
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeJoinQueueModal);

  // Student mark all notifications as read
  const markReadBtn = document.getElementById('btn-mark-all-read');
  if (markReadBtn) markReadBtn.addEventListener('click', handleMarkAllNotificationsRead);

  // Staff Queue Action Buttons (Top & Home)
  const staffCallNext = () => {
    if (currentUser && currentUser.role === 'STAFF') handleStaffCallNext(currentUser.assignedOffice);
  };
  const staffComplete = () => {
    if (currentUser && currentUser.role === 'STAFF') handleStaffCompleteTicket(currentUser.assignedOffice);
  };
  const staffSkip = () => {
    if (currentUser && currentUser.role === 'STAFF') handleStaffSkipTicket(currentUser.assignedOffice);
  };

  const btnCallNext = document.getElementById('btn-call-next');
  const btnCallNextHome = document.getElementById('btn-staff-call-next-home');
  if (btnCallNext) btnCallNext.addEventListener('click', staffCallNext);
  if (btnCallNextHome) btnCallNextHome.addEventListener('click', staffCallNext);

  const btnComplete = document.getElementById('btn-mark-completed');
  const btnCompleteHome = document.getElementById('btn-staff-complete-home');
  if (btnComplete) btnComplete.addEventListener('click', staffComplete);
  if (btnCompleteHome) btnCompleteHome.addEventListener('click', staffComplete);

  const btnSkip = document.getElementById('btn-skip-ticket');
  const btnSkipHome = document.getElementById('btn-staff-skip-home');
  if (btnSkip) btnSkip.addEventListener('click', staffSkip);
  if (btnSkipHome) btnSkipHome.addEventListener('click', staffSkip);

  // Admin: Add Office Toggle & Form
  const btnAddOffice = document.getElementById('btn-add-office');
  const addOfficePanel = document.getElementById('add-office-form-container');
  const btnCancelAddOffice = document.getElementById('btn-cancel-add-office');
  const addOfficeForm = document.getElementById('add-office-form');

  if (btnAddOffice && addOfficePanel) {
    btnAddOffice.addEventListener('click', () => {
      addOfficePanel.hidden = !addOfficePanel.hidden;
    });
  }
  if (btnCancelAddOffice && addOfficePanel) {
    btnCancelAddOffice.addEventListener('click', () => {
      addOfficePanel.hidden = true;
    });
  }
  if (addOfficeForm) addOfficeForm.addEventListener('submit', handleAddOffice);

  // Admin: Add User Toggle & Form
  const btnAddUser = document.getElementById('btn-add-user');
  const addUserPanel = document.getElementById('add-user-form-container');
  const btnCancelAddUser = document.getElementById('btn-cancel-add-user');
  const addUserForm = document.getElementById('add-user-form');

  if (btnAddUser && addUserPanel) {
    btnAddUser.addEventListener('click', () => {
      addUserPanel.hidden = !addUserPanel.hidden;
    });
  }
  if (btnCancelAddUser && addUserPanel) {
    btnCancelAddUser.addEventListener('click', () => {
      addUserPanel.hidden = true;
    });
  }
  if (addUserForm) addUserForm.addEventListener('submit', handleAddUser);
}

// --------------------------------------------------------------------------
// 11. APPLICATION BOOTSTRAP
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();

  // If a user session is remembered, route directly to their dashboard; else show login
  if (currentUser) {
    routeUserToDashboard(currentUser);
  } else {
    showScreen('screen-login');
  }
});
