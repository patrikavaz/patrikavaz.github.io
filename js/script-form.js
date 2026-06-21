// ============================================
// تنظیمات اولیه
// ============================================
const STORAGE_KEY = 'user_data_list';
const form = document.getElementById('infoForm');
const messageEl = document.getElementById('message');
const dataListEl = document.getElementById('dataList');
const submitBtn = document.getElementById('submitBtn');

// ============================================
// توابع مدیریت localStorage
// ============================================

// دریافت اطلاعات از localStorage
function getData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('خطا در خواندن داده:', error);
        return [];
    }
}

// ذخیره اطلاعات در localStorage
function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('خطا در ذخیره داده:', error);
        showMessage('❌ خطا در ذخیره اطلاعات در مرورگر', 'error');
    }
}

// ============================================
// توابع نمایش اطلاعات
// ============================================

// نمایش لیست اطلاعات ذخیره شده
function displayData() {
    const data = getData();
    
    if (data.length === 0) {
        dataListEl.innerHTML = '<p class="empty-message">📭 هنوز اطلاعاتی ذخیره نشده است.</p>';
        return;
    }
    
    // نمایش به ترتیب جدیدترین (برعکس)
    const reversedData = [...data].reverse();
    dataListEl.innerHTML = reversedData.map((item, index) => {
        const originalIndex = data.length - 1 - index;
        return `
            <div class="data-item">
                <button class="delete-btn" onclick="deleteData(${originalIndex})">🗑️ حذف</button>
                <div class="text-content"><strong>متن:</strong> ${escapeHtml(item.text)}</div>
                <div class="number-content"><strong>شماره:</strong> ${item.number}</div>
                <span class="timestamp">📅 ${new Date(item.timestamp).toLocaleString('fa-IR')}</span>
            </div>
        `;
    }).join('');
}

// جلوگیری از حملات XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// توابع مدیریت داده‌ها
// ============================================

// حذف یک آیتم
function deleteData(index) {
    if (!confirm('⚠️ آیا مطمئنید می‌خواهید این آیتم را حذف کنید؟')) {
        return;
    }
    
    const data = getData();
    data.splice(index, 1);
    saveData(data);
    displayData();
    showMessage('🗑️ آیتم با موفقیت حذف شد.', 'success');
}

// اضافه کردن داده جدید
function addData(text, number) {
    const data = getData();
    const newData = {
        text: text.trim(),
        number: parseInt(number),
        timestamp: Date.now()
    };
    data.push(newData);
    saveData(data);
    displayData();
}

// ============================================
// توابع پیام و اطلاع‌رسانی
// ============================================

function showMessage(msg, type) {
    messageEl.textContent = msg;
    messageEl.className = 'message ' + type;
    
    // بعد از ۷ ثانیه پیام رو مخفی کن (به جز خطاها)
    if (type !== 'error') {
        clearTimeout(messageEl._timeout);
        messageEl._timeout = setTimeout(() => {
            messageEl.className = 'message';
        }, 7000);
    }
}

// ============================================
// مدیریت ارسال فرم
// ============================================

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // گرفتن مقادیر فیلدها
    const textInfo = document.getElementById('textInfo').value.trim();
    const numberInfo = document.getElementById('numberInfo').value.trim();
    
    // اعتبارسنجی سمت کلاینت
    if (!textInfo || !numberInfo) {
        showMessage('❌ لطفاً تمام فیلدهای اجباری را پر کنید!', 'error');
        return;
    }
    
    if (isNaN(numberInfo) || parseInt(numberInfo) <= 0) {
        showMessage('❌ لطفاً یک شماره معتبر (بزرگتر از صفر) وارد کنید!', 'error');
        return;
    }
    
    // نمایش وضعیت در حال ارسال
    showMessage('⏳ در حال ارسال اطلاعات به ایمیل...', 'loading');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ در حال ارسال...';
    
    try {
        // ارسال به Web3Forms
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            // ذخیره در localStorage
            addData(textInfo, numberInfo);
            
            showMessage('✅ اطلاعات با موفقیت ارسال و ذخیره شد!', 'success');
            form.reset();
        } else {
            showMessage('❌ خطا در ارسال: ' + (result.message || 'مشکل ناشناخته'), 'error');
        }
    } catch (error) {
        showMessage('❌ خطا در ارتباط با سرور: ' + error.message, 'error');
        console.error('خطای ارسال:', error);
    } finally {
        // فعال کردن مجدد دکمه
        submitBtn.disabled = false;
        submitBtn.textContent = '📧 ارسال اطلاعات';
    }
});

// ============================================
// بارگذاری اولیه
// ============================================

// نمایش اطلاعات ذخیره شده در localStorage
displayData();

// ============================================
// (اختیاری) اعتبارسنجی بلادرنگ
// ============================================

// محدود کردن فیلد شماره به اعداد مثبت
document.getElementById('numberInfo').addEventListener('input', function() {
    if (this.value < 0) {
        this.value = 1;
    }
});

// نمایش تعداد کاراکترهای باقیمانده برای فیلد متن
document.getElementById('textInfo').addEventListener('input', function() {
    const maxLength = 500;
    if (this.value.length > maxLength) {
        this.value = this.value.substring(0, maxLength);
        showMessage(`⚠️ متن نمی‌تواند بیشتر از ${maxLength} کاراکتر باشد.`, 'error');
    }
});

console.log('✅ فرم با موفقیت بارگذاری شد!');
console.log(`📊 تعداد اطلاعات ذخیره شده: ${getData().length}`);
