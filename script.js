// ============ INISIALISASI EMAILJS ============
(function() {
  try {
    emailjs.init("niJs9o1gPTTKZ4rrW");
    console.log("EmailJS initialized successfully");
  } catch (error) {
    console.error("EmailJS initialization failed:", error);
    alert("Sistem sedang mengalami gangguan. Silakan coba lagi nanti.");
  }
})();

// ============ DARK MODE TOGGLE ============
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  
  // Cek preferensi pengguna dari localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.setAttribute("data-theme", "dark");
    if (darkModeToggle) darkModeToggle.textContent = "☀️";
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const isDark = body.getAttribute("data-theme") === "dark";
      body.setAttribute("data-theme", isDark ? "light" : "dark");
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      darkModeToggle.textContent = isDark ? "☀️" : "🌙";
    });
  }
});

// ============ SCROLL KE FORM ============
function scrollToForm() {
  const bookingSection = document.getElementById("booking");
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth" });
  }
}

// ============ ANIMASI FADE-IN SAAT SCROLL ============
document.addEventListener('DOMContentLoaded', function() {
  const fadeInElements = document.querySelectorAll(".court-card, .testi-card, .booking-form");
  
  if (fadeInElements.length > 0) {
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    fadeInElements.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      fadeInObserver.observe(el);
    });
  }
});

// ============ FORM SUBMISSION + EMAILJS + WHATSAPP ============
document.addEventListener('DOMContentLoaded', function() {
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Cegah reload halaman

      const form = e.target;

      // Ambil data dari form
      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        court: form.court.value,
        date: form.date.value,
        timeStart: form.timeStart.value,
        timeEnd: form.timeEnd.value,
        notes: form.notes.value.trim() || "",
      };

      // Validasi sederhana
      if (!formData.name || !formData.email || !formData.court || !formData.date || !formData.timeStart || !formData.timeEnd) {
        alert("Mohon lengkapi semua field yang wajib diisi!");
        return;
      }

      // ============ VALIDASI TAMBAHAN ============
      // 1. Validasi tanggal tidak boleh sebelum hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset waktu ke awal hari
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0); // Reset waktu untuk perbandingan

      if (selectedDate < today) {
        alert("Tidak bisa booking untuk tanggal sebelum hari ini.");
        return;
      }

      // 2. Validasi durasi minimal 2 jam dan maksimal 24 jam
      const startDateTime = new Date(`${formData.date}T${formData.timeStart}`);
      const endDateTime = new Date(`${formData.date}T${formData.timeEnd}`);

      // Pastikan jam selesai lebih dari jam mulai
      if (endDateTime <= startDateTime) {
        alert("Jam selesai harus lebih dari jam mulai.");
        return;
      }

      // Hitung durasi dalam jam
      const durationMs = endDateTime - startDateTime;
      const durationHours = durationMs / (1000 * 60 * 60);

      if (durationHours < 2) {
        alert("Minimal durasi booking adalah 2 jam.");
        return;
      }

      if (durationHours > 24) {
        alert("Maksimal durasi booking adalah 24 jam.");
        return;
      }
      // ============ AKHIR VALIDASI TAMBAHAN ============

      // Format tanggal ke bahasa Indonesia
      let dateFormatted = "";
      try {
        dateFormatted = new Date(formData.date).toLocaleDateString("id-ID", {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch (error) {
        console.error("Date formatting error:", error);
        dateFormatted = formData.date; // Fallback to raw date
      }

      // Tampilkan loading
      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Mengirim...";

      // KIRIM EMAIL VIA EMAILJS
      emailjs.send("service_ecbjfyt", "template_ukt68pd", {
        ...formData,
        date: dateFormatted
      })
      .then(() => {
        // ✅ Sukses: Tampilkan pesan & buka WhatsApp
        
        // Buat pesan WhatsApp yang lebih ringkas
        let waMessageContent = `Halo Raketin! Saya ${formData.name} booking:\n`;
        waMessageContent += `🏸 ${formData.court}\n`;
        waMessageContent += `📅 ${dateFormatted}\n`;
        waMessageContent += `⏰ ${formData.timeStart} - ${formData.timeEnd}\n`;
        
        // Tambahkan catatan jika ada (maks 100 karakter)
        if (formData.notes && formData.notes.length > 0) {
          // Batasi panjang catatan untuk menghindari URL terlalu panjang
          const maxNotesLength = 100;
          const notesDisplay = formData.notes.length > maxNotesLength 
            ? formData.notes.substring(0, maxNotesLength) + "..." 
            : formData.notes;
            
          waMessageContent += `\n📝 Catatan: ${notesDisplay}\n`;
        }
        
        waMessageContent += `\nSudah terima email konfirmasi.`;
        
        const waNumber = "6282120843622"; // Nomor admin
        const waMessage = encodeURIComponent(waMessageContent);
        
        // URL WhatsApp yang benar (tanpa spasi)
        const whatsappUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
        
        // Buka WhatsApp setelah delay kecil untuk memastikan DOM siap
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          
          // Tampilkan alert setelah membuka WhatsApp
          alert("✅ Booking berhasil! Cek email Anda untuk konfirmasi detail.");
          
          // Reset form & kembalikan tombol
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 300);
      })
      .catch((error) => {
        // ❌ Gagal
        console.error("Gagal kirim email:", error);
        
        // Tampilkan pesan error lebih detail
        let errorMessage = "❌ Gagal mengirim konfirmasi.";
        if (error.text) {
          errorMessage += `\n${error.text}`;
        }
        
        // Tambahkan pesan spesifik berdasarkan jenis error
        if (error.status === 400) {
          errorMessage += "\nKesalahan konfigurasi. Hubungi admin website.";
        } else if (error.status === 401) {
          errorMessage += "\nOtentikasi gagal. Hubungi admin website.";
        }
        
        errorMessage += "\nCoba lagi nanti.";
        
        alert(errorMessage);
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    });
  }
});