// ---- generate a friendly tracking number for this visit ----
const ticketEl = document.getElementById('ticketId');
const ticketNumber = Math.floor(10000 + Math.random() * 89999);
ticketEl.textContent = '#KF-' + ticketNumber;


const WEB3FORMS_ACCESS_KEY = "bb273da0-ac18-44a1-ac52-5f3a514cb3a7";

const form = document.getElementById('requestForm');
const submitBtn = document.getElementById('submitBtn');
const btnLabel = document.getElementById('btnLabel');
const btnIcon = document.getElementById('btnIcon');
const statusMsg = document.getElementById('statusMsg');

function showStatus(type, text){
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg show ' + type;
}

function setLoading(loading){
  submitBtn.disabled = loading;
  if(loading){
    btnLabel.textContent = 'در حال ارسال...';
    btnIcon.outerHTML = '<span class="spinner" id="btnIcon"></span>';
  } else {
    btnLabel.textContent = 'ثبت سفارش رایگان';
    document.getElementById('btnIcon').outerHTML =
      '<svg id="btnIcon" viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="11 18 5 12 11 6"></polyline></svg>';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusMsg.classList.remove('show');

  if (WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY"){
    showStatus('err', 'برای فعال‌سازی فرم، کلید Web3Forms رو داخل کد جایگذاری کن.');
    return;
  }

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: 'درخواست جدید خدمت — کافی‌نت آنلاین',
    from_name: 'فرم سایت کافی‌نت',
    ticket_id: ticketEl.textContent,
    name: form.name.value,
    phone: form.phone.value,
    service: form.service.value,
    message: form.message.value,
    botcheck: form.botcheck.value
  };

  setLoading(true);

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success){
      showStatus('ok', 'درخواستت با کد پیگیری ' + ticketEl.textContent + ' ثبت شد. به‌زودی باهات تماس می‌گیریم.');
      form.reset();
      ticketEl.textContent = '#KF-' + Math.floor(10000 + Math.random() * 89999);
    } else {
      showStatus('err', 'ارسال درخواست با خطا مواجه شد. لطفاً دوباره تلاش کن.');
    }
  } catch (err){
    showStatus('err', 'مشکل در اتصال به اینترنت. لطفاً دوباره تلاش کن.');
  } finally {
    setLoading(false);
  }
});
