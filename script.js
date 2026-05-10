// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.add('scrolled'); // keep it or remove based on design. Let's remove.
        navbar.classList.remove('scrolled');
    }
});

// --- Paradise Club Membership Logic ---

// State
let userState = {
    userId: "USR-89234",
    name: "Eleanor Vance",
    totalSpend: 0,
    tier: "Silver Tier",
    vouchers: []
};

// Elements
const purchaseButtons = document.querySelectorAll('.btn-add');
const totalSpendEl = document.getElementById('total-spend');
const memberStatsEl = document.getElementById('member-stats');
const cardTierEl = document.getElementById('card-tier');
const vouchersListEl = document.getElementById('vouchers-list');

const toastEl = document.getElementById('toast');
const toastMessageEl = document.getElementById('toast-message');

const modalEl = document.getElementById('voucher-modal');
const closeBtn = document.querySelector('.close-btn');
const voucherAmountEl = document.getElementById('voucher-amount');
const voucherCodeEl = document.getElementById('voucher-code');
const voucherExpiryEl = document.getElementById('voucher-expiry');
const copyBtn = document.getElementById('copy-btn');

// Trigger perk logic
const PERK_THRESHOLD = 100;

purchaseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const price = parseFloat(e.target.dataset.price);
        const itemName = e.target.dataset.name;
        
        // Update state
        userState.totalSpend += price;
        updateUI();

        // Check threshold
        if (userState.totalSpend >= PERK_THRESHOLD && userState.vouchers.length === 0) {
            triggerPerk();
        } else if (userState.totalSpend >= 500 && userState.tier !== "Gold Tier") {
            upgradeTier("Gold Tier");
        }
        
        // Show item added toast temporarily
        showToast(`Added ${itemName} to your collection.`);
    });
});

function updateUI() {
    memberStatsEl.style.display = 'block';
    totalSpendEl.innerText = userState.totalSpend.toFixed(2);
    cardTierEl.innerText = userState.tier;
    
    if(userState.tier === "Gold Tier") {
        cardTierEl.style.color = "#C5A059";
    }
}

function triggerPerk() {
    // Generate Voucher
    const amount = 50;
    const code = `PARADISE-${amount}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 2); // Valid for 2 months
    
    const voucher = {
        amount,
        code,
        expiry: expiryDate.toLocaleDateString()
    };
    
    userState.vouchers.push(voucher);
    
    // Update Voucher List in Stats
    vouchersListEl.innerHTML = `<p style="color:var(--primary-gold); margin-top:10px;"><b>Active Voucher:</b> $${amount} Off (Code: ${code})</p>`;
    
    // Show Modal
    setTimeout(() => {
        showVoucherModal(voucher);
    }, 1000);
}

function upgradeTier(newTier) {
    userState.tier = newTier;
    updateUI();
    setTimeout(() => {
        showToast(`Congratulations! You've been upgraded to ${newTier}!`);
    }, 500);
}

function showToast(message) {
    toastMessageEl.innerText = message;
    toastEl.classList.remove('hidden');
    
    setTimeout(() => {
        toastEl.classList.add('hidden');
    }, 4000);
}

function showVoucherModal(voucher) {
    voucherAmountEl.innerText = `$${voucher.amount}`;
    voucherCodeEl.innerText = voucher.code;
    voucherExpiryEl.innerText = `Valid until: ${voucher.expiry}`;
    modalEl.classList.remove('hidden');
}

// Modal actions
closeBtn.addEventListener('click', () => {
    modalEl.classList.add('hidden');
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(voucherCodeEl.innerText);
    copyBtn.innerText = "Copied!";
    setTimeout(() => {
        copyBtn.innerText = "Copy";
    }, 2000);
});

// --- Digital Card Tilt Effect ---
const card = document.getElementById('digital-card');

card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
    const rotateY = ((x - centerX) / centerX) * 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
});

card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
});
