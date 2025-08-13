// ============ INISIALISASI EMAILJS ============
(function() {
  try {
    emailjs.init("niJs9o1gPTTKZ4rrW");
    console.log("EmailJS initialized successfully");
  } catch (error) {
    console.error("EmailJS initialization failed:", error);
    // Membuat custom alert styling
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '20px';
    alertBox.style.right = '20px';
    alertBox.style.backgroundColor = '#ff4444';
    alertBox.style.color = 'white';
    alertBox.style.padding = '15px 25px';
    alertBox.style.borderRadius = '8px';
    alertBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    alertBox.style.zIndex = '9999';
    alertBox.style.fontFamily = 'Montserrat, sans-serif';
    alertBox.style.fontSize = '16px';
    alertBox.style.maxWidth = '300px';
    alertBox.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
    alertBox.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span style="margin-right: 10px; font-size: 20px;">❌</span>
        <div>
          <strong>Sistem Error</strong><br>
          Sistem sedang mengalami gangguan. Silakan coba lagi nanti.
        </div>
      </div>
    `;
    
    document.body.appendChild(alertBox);
    
    // Hapus alert setelah 3 detik
    setTimeout(() => {
      alertBox.style.animation = 'fadeOut 0.3s';
      setTimeout(() => {
        if (document.body.contains(alertBox)) {
          document.body.removeChild(alertBox);
        }
      }, 300);
    }, 3000);
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

// ============ CUSTOM ALERT FUNCTION ============
function showAlert(message, type = 'error') {
  // Hapus alert lama jika ada
  const existingAlert = document.querySelector('.custom-alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // Buat alert baru
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  alertBox.style.position = 'fixed';
  alertBox.style.top = '20px';
  alertBox.style.right = '20px';
  alertBox.style.backgroundColor = type === 'success' ? '#4CAF50' : '#ff4444';
  alertBox.style.color = 'white';
  alertBox.style.padding = '15px 25px';
  alertBox.style.borderRadius = '8px';
  alertBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  alertBox.style.zIndex = '9999';
  alertBox.style.fontFamily = 'Montserrat, sans-serif';
  alertBox.style.fontSize = '16px';
  alertBox.style.maxWidth = '300px';
  alertBox.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
  alertBox.style.transition = 'opacity 0.3s';
  
  // Konten alert
  const [emoji, title] = type === 'success' ? ['✅', 'Berhasil!'] : ['❌', 'Gagal!'];
  alertBox.innerHTML = `
    <div style="display: flex; align-items: center;">
      <span style="margin-right: 10px; font-size: 20px;">${emoji}</span>
      <div>
        <strong>${title}</strong><br>
        ${message}
      </div>
    </div>
  `;
  
  document.body.appendChild(alertBox);
  
  // Hapus alert setelah 3 detik
  setTimeout(() => {
    alertBox.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(alertBox)) {
        document.body.removeChild(alertBox);
      }
    }, 300);
  }, 3000);
}

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
        showAlert("Mohon lengkapi semua field yang wajib diisi!", "error");
        return;
      }

      // ============ VALIDASI TAMBAHAN ============
      // 1. Validasi tanggal tidak boleh sebelum hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset waktu ke awal hari
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0); // Reset waktu untuk perbandingan

      if (selectedDate < today) {
        showAlert("Tidak bisa booking untuk tanggal sebelum hari ini.", "error");
        return;
      }

      // 2. Validasi durasi minimal 1 jam dan maksimal 24 jam
      const startDateTime = new Date(`${formData.date}T${formData.timeStart}`);
      const endDateTime = new Date(`${formData.date}T${formData.timeEnd}`);

      // Pastikan jam selesai lebih dari jam mulai
      if (endDateTime <= startDateTime) {
        showAlert("Jam selesai harus lebih dari jam mulai.", "error");
        return;
      }

      // Hitung durasi dalam jam
      const durationMs = endDateTime - startDateTime;
      const durationHours = durationMs / (1000 * 60 * 60);

      if (durationHours < 1) {
        showAlert("Minimal durasi booking adalah 1 jam.", "error");
        return;
      }

      if (durationHours > 24) {
        showAlert("Maksimal durasi booking adalah 24 jam.", "error");
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
          
          // Tampilkan custom alert
          showAlert("Booking berhasil! Cek email Anda untuk konfirmasi detail.", "success");
          
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
        let errorMessage = "Gagal mengirim konfirmasi.";
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
        
        showAlert(errorMessage, "error");
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    });
  }
});

// ============ SET MIN DATE FOR BOOKING ============
document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('date');
  
  if (dateInput) {
    // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;
    
    // Set atribut min untuk input tanggal
    dateInput.setAttribute('min', todayFormatted);
    
    // Opsional: Set tanggal default ke hari ini
    if (!dateInput.value) {
      dateInput.value = todayFormatted;
    }
    
    console.log("Tanggal minimum diatur ke:", todayFormatted);
  }
});