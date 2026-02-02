// نظام النقاط الماليزي المحدث
const updatedGradePoints = {
    'A+': 4.00, 'A': 4.00, 'A-': 3.67,
    'B+': 3.33, 'B': 3.00, 'B-': 2.67,
    'C+': 2.33, 'C': 2.00, 'C-': 1.67,
    'D+': 1.33, 'D': 1.00, 'F': 0.00
};

// متغيرات السحب (Swipe)
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
let currentTranslate = 0;

// دالة فتح القائمة الجانبية
function openGpaSidebar() {
    const sidebar = document.getElementById('gpa-sidebar');
    const overlay = document.getElementById('gpa-overlay');
    if (sidebar && overlay) {
        sidebar.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        currentTranslate = 0;
        if (sidebar.style.transform) sidebar.style.transform = '';
        updateShahabMessageForGPA('open');
        
        // حساب مباشر عند فتح القائمة
        setTimeout(() => {
            calculateGPA();
        }, 100);
    }
}

// دالة إغلاق القائمة الجانبية
function closeGpaSidebar() {
    const sidebar = document.getElementById('gpa-sidebar');
    const overlay = document.getElementById('gpa-overlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        currentTranslate = 0;
        if (sidebar.style.transform) sidebar.style.transform = '';
        isDragging = false;
    }
}

// دالة إضافة صف جديد للجدول
function addCourseRow() {
    const coursesBody = document.getElementById('courses-body');
    if (!coursesBody) return;
    
    const newRow = coursesBody.insertRow();
    const gradeOptions = Object.keys(updatedGradePoints).map(grade => 
        `<option value="${grade}">${grade}</option>`
    ).join('');
    
    const lang = document.documentElement.getAttribute('lang') || 'ar';
    const courseNamePlaceholder = lang === 'ar' ? 'اسم المادة' : 'Course Name';
    const deleteBtn = lang === 'ar' ? 'حذف' : 'Delete';
    
    newRow.innerHTML = `
        <td><input type="text" class="gpa-input" placeholder="${courseNamePlaceholder}" onchange="calculateGPA()" oninput="calculateGPA()"></td>
        <td><input type="number" min="1" value="3" class="gpa-input credit-input" onchange="calculateGPA()" oninput="calculateGPA()"></td>
        <td>
            <select class="gpa-select" onchange="calculateGPA()">
                ${gradeOptions}
            </select>
        </td>
        <td><button class="delete-btn" onclick="deleteCourseRow(this)"><i class="fas fa-trash"></i> ${deleteBtn}</button></td>
    `;
    
    newRow.querySelector('select').value = 'A';
    calculateGPA();
    updateShahabMessageForGPA('add');
}

// دالة حذف الصف
function deleteCourseRow(button) {
    const row = button.parentNode.parentNode;
    if (row && row.parentNode) {
        row.parentNode.removeChild(row);
        calculateGPA();
        updateShahabMessageForGPA('delete');
    }
}

// دالة حساب المعدل الرئيسية
function calculateGPA() {
    const coursesBody = document.getElementById('courses-body');
    if (!coursesBody) return;
    
    let totalCreditHours = 0;
    let totalGradePoints = 0;
    
    for (let i = 0; i < coursesBody.rows.length; i++) {
        const row = coursesBody.rows[i];
        const creditInput = row.cells[1]?.querySelector('.credit-input');
        const gradeSelect = row.cells[2]?.querySelector('select');
        
        if (!creditInput || !gradeSelect) continue;
        
        const creditHours = parseFloat(creditInput.value) || 0;
        const grade = gradeSelect.value;
        const pointValue = updatedGradePoints[grade] || 0;
        const coursePoints = creditHours * pointValue;
        
        totalCreditHours += creditHours;
        totalGradePoints += coursePoints;
    }
    
    const gpa = totalCreditHours > 0 ? (totalGradePoints / totalCreditHours).toFixed(2) : '0.00';
    
    const totalCreditsEl = document.getElementById('total-credits');
    const calculatedGpaEl = document.getElementById('calculated-gpa');
    
    if (totalCreditsEl) {
        totalCreditsEl.textContent = Math.round(totalCreditHours);
        totalCreditsEl.innerHTML = Math.round(totalCreditHours);
    }
    
    if (calculatedGpaEl) {
        calculatedGpaEl.textContent = gpa;
        calculatedGpaEl.innerHTML = gpa;
    }
    
    updateShahabMessage(gpa);
}

// دالة تحديث رسالة شهاب
function updateShahabMessage(cgpa) {
    const messageDiv = document.getElementById('shahab-message');
    if (!messageDiv) return;
    
    const cgpaNumber = parseFloat(cgpa);
    const coursesBody = document.getElementById('courses-body');
    const rowCount = coursesBody ? coursesBody.rows.length : 0;
    
    const lang = document.documentElement.getAttribute('lang') || 'ar';
    let messageText = '';
    
    if (cgpaNumber === 0.00 && rowCount === 0) {
        messageText = lang === 'ar' 
            ? 'هيا بنا نبدأ بإدخال بيانات أول مادة لمعرفة معدلك الحالي!'
            : 'Let\'s start by adding your first course to calculate your GPA!';
    } else if (cgpaNumber >= 3.7) {
        messageText = lang === 'ar'
            ? '🎉 شهاب يقول: أداؤك مذهل! استمر في التفوق لتحقق الـ 4.0 الكاملة!'
            : '🎉 Shihab says: Outstanding performance! Keep excelling to achieve a perfect 4.0!';
    } else if (cgpaNumber >= 3.0) {
        messageText = lang === 'ar'
            ? '👍 شهاب يقول: أداؤك جيد جداً! استمر في العمل الجاد!'
            : '👍 Shihab says: Great performance! Keep up the hard work!';
    } else if (cgpaNumber >= 2.0) {
        messageText = lang === 'ar'
            ? '💪 شهاب يقول: أنت على الطريق الصحيح! استمر في التحسين!'
            : '💪 Shihab says: You\'re on the right track! Keep improving!';
    } else if (cgpaNumber > 0) {
        messageText = lang === 'ar'
            ? '📚 شهاب يقول: لا تستسلم! العمل الجاد سيحسن معدلك!'
            : '📚 Shihab says: Don\'s give up! Hard work will improve your GPA!';
    } else {
        messageText = lang === 'ar'
            ? '🎯 شهاب يقول: ابدأ بإدخال موادك واحسب معدلك!'
            : '🎯 Shihab says: Start adding your courses and calculate your GPA!';
    }
    
    messageDiv.textContent = messageText;
}

// دالة تحديث رسالة شهاب عند فتح/إضافة/حذف
function updateShahabMessageForGPA(action) {
    const speechBubble = document.getElementById('speechBubble');
    const speechText = document.getElementById('speechText');
    
    if (!speechBubble || !speechText) return;
    
    const lang = document.documentElement.getAttribute('lang') || 'ar';
    let message = '';
    
    if (action === 'open') {
        message = lang === 'ar'
            ? 'ممتاز! أداة حساب المعدل جاهزة! 🎓'
            : 'Great! GPA calculator is ready! 🎓';
    } else if (action === 'add') {
        message = lang === 'ar'
            ? 'ممتاز! أضفت مادة جديدة! 📝'
            : 'Great! You added a new course! 📝';
    } else if (action === 'delete') {
        message = lang === 'ar'
            ? 'تم حذف المادة! ✅'
            : 'Course deleted! ✅';
    }
    
    if (message) {
        speechText.textContent = message;
        speechBubble.classList.add('show');
        setTimeout(() => {
            speechBubble.classList.remove('show');
        }, 3000);
    }
}

// وظائف السحب (Swipe) - محسّنة للأداء
function handleTouchStart(e) {
    const sidebar = document.getElementById('gpa-sidebar');
    if (!sidebar || !sidebar.classList.contains('open')) return;
    
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = true;
    sidebar.style.transition = 'none';
}

function handleTouchMove(e) {
    if (!isDragging) {
        e.preventDefault();
        return;
    }
    
    const sidebar = document.getElementById('gpa-sidebar');
    if (!sidebar || !sidebar.classList.contains('open')) {
        isDragging = false;
        return;
    }
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX;
    const diffY = Math.abs(currentY - touchStartY);
    
    if (diffY > Math.abs(diffX) * 0.5) {
        isDragging = false;
        sidebar.style.transition = '';
        sidebar.style.transform = '';
        currentTranslate = 0;
        return;
    }
    
    if (diffX < 0) {
        e.preventDefault();
        const translateX = Math.max(diffX, -sidebar.offsetWidth);
        currentTranslate = translateX;
        sidebar.style.transform = `translateX(${translateX}px)`;
    }
}

function handleTouchEnd() {
    if (!isDragging) return;
    
    const sidebar = document.getElementById('gpa-sidebar');
    if (!sidebar) return;
    
    isDragging = false;
    sidebar.style.transition = 'transform 0.3s ease';
    
    if (Math.abs(currentTranslate) > sidebar.offsetWidth * 0.3) {
        setTimeout(closeGpaSidebar, 50);
    } else {
        sidebar.style.transform = '';
        currentTranslate = 0;
    }
}

// تهيئة الأحداث عند تحميل الصفحة
(function initGPACalculator() {
    const init = () => {
        const sidebar = document.getElementById('gpa-sidebar');
        const overlay = document.getElementById('gpa-overlay');
        const gpaToggleBtn = document.getElementById('gpa-toggle-btn');
        
        if (!sidebar || !overlay) return;
        
        // Event listeners للسحب
        let touchHandlerAdded = false;
        function addTouchHandlers() {
            if (touchHandlerAdded) return;
            sidebar.addEventListener('touchstart', handleTouchStart, { passive: true });
            sidebar.addEventListener('touchmove', handleTouchMove, { passive: false });
            sidebar.addEventListener('touchend', handleTouchEnd, { passive: true });
            touchHandlerAdded = true;
        }
        
        const originalOpen = window.openGpaSidebar || openGpaSidebar;
        window.openGpaSidebar = function() {
            addTouchHandlers();
            originalOpen();
        };
        
        overlay.addEventListener('click', closeGpaSidebar);
        sidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        if (gpaToggleBtn) {
            gpaToggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openGpaSidebar();
            });
        }
        
        // إضافة صف افتراضي فقط عند فتح القائمة لأول مرة
        const coursesBody = document.getElementById('courses-body');
        if (coursesBody && coursesBody.rows.length === 0) {
            addCourseRow();
        }
        
        // التأكد من أن الدوال متاحة بشكل عام
        window.addCourseRow = addCourseRow;
        window.deleteCourseRow = deleteCourseRow;
        window.calculateGPA = calculateGPA;
        window.closeGpaSidebar = closeGpaSidebar;
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// دعم اللغة
if (window.i18nUpdateElements) {
    document.addEventListener('langChanged', function() {
        calculateGPA();
    });
}
