$(document).ready(function() {
    // 1. إظهار وإخفاء تفاصيل السيارة عبر jQuery
    $('.toggle-details').change(function() {
        $(this).closest('tr').next('.details-row').toggle();
    });

    // 2. إظهار نموذج الحجز عند الضغط على زر المتابعة بعد اختيار سيارة
    $('#proceed-btn').click(function() {
        var selectedCar = $('input[name="car_choice"]:checked').val();
        if (!selectedCar) {
            alert('الرجاء اختيار سيارة من الجدول أولاً!');
            return;
        }
        $('#booking-section').toggle();
    });

    // 3. التحقق من صحة المدخلات وحساب التكلفة عند إرسال النموذج
    $('#car-form').submit(function(e) {
        e.preventDefault();

        var fullname = $('#fullname').val();
        var nationalId = $('#national_id').val();
        var startDate = $('#start_date').val();
        var endDate = $('#end_date').val();
        var mobile = $('#mobile').val();
        var email = $('#email').val();

        // التحقق من الاسم (أحرف هجائية عربية فقط)
        var nameRegex = /^[\u0600-\u06FF\s]+$/;
        if (!nameRegex.test(fullname)) {
            alert('الاسم الكامل يجب أن يحتوي على أحرف هجائية عربية فقط.');
            return;
        }

        // التحقق من الرقم الوطني (11 خانة، وأول خانتين من 01 إلى 14)
        var idRegex = /^(0[1-9]|1[0-4])\d{9}$/;
        if (!idRegex.test(nationalId)) {
            alert('الرقم الوطني يجب أن يتكون من 11 خانة وتبدأ أول خانتين برمز محافظة صحيح (من 01 إلى 14).');
            return;
        }

        // التحقق من صيغة التواريخ yyyy-mm-dd
        var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            alert('التاريخ يجب أن يكون بالصيغة الصحيحة yyyy-mm-dd.');
            return;
        }

        // حساب عدد أيام التأجير والتسلسل الزمني
        var start = new Date(startDate);
        var end = new Date(endDate);
        var diffTime = end - start;
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            alert('تاريخ نهاية التأجير يجب أن يكون لاحقاً لتاريخ البداية.');
            return;
        }

        // التحقق من رقم الموبايل (يطابق شبكات Syriatel و MTN ويبدأ بـ 09)
        var mobileRegex = /^09\d{8}$/;
        if (!mobileRegex.test(mobile)) {
            alert('رقم الموبايل غير صالح (يجب أن يتكون من 10 أرقام ويبدأ بـ 09 مثل أرقام Syriatel و MTN).');
            return;
        }

        // التحقق من صحة البريد الإلكتروني
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('البريد الإلكتروني المدخل غير صالح.');
            return;
        }

        // تحديد السعر اليومي حسب السيارة المختارة (تشمل السيارات الخمسة)
        var dailyRate = 250000; // CR-001
        var selectedCar = $('input[name="car_choice"]:checked').val();
        if(selectedCar === 'CR-002') dailyRate = 400000;
        if(selectedCar === 'CR-003') dailyRate = 300000;
        if(selectedCar === 'CR-004') dailyRate = 180000;
        if(selectedCar === 'CR-005') dailyRate = 200000;

        var totalAmount = diffDays * dailyRate;
        var discountMessage = "";

        // تطبيق خصم 5% في حال تجاوزت مدة التأجير 10 أيام
        if (diffDays > 10) {
            totalAmount = totalAmount * 0.95;
            discountMessage = "\nتم تطبيق خصم 5% لتجاوز مدة التأجير 10 أيام.";
        }

        // إظهار نافذة النتيجة بالمعلومات النهائية (عدد الأيام، المجموع، المبلغ النهائي)
        alert("نجاح الحجز!\n" +
              "السيارة المختارة: " + selectedCar + "\n" +
              "عدد أيام التأجير: " + diffDays + " أيام\n" +
              "المبلغ الإجمالي: " + totalAmount + " ل.س" + discountMessage);
    });
});