// ============ INISIALISASI EMAILJS ============
(function() {
  emailjs.init("niJs9o1gPTTKZ4rrW");
})();

// ============ DARK MODE TOGGLE ============
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

darkModeToggle.addEventListener("click", () => {
  const isDark = body.getAttribute("data-theme") === "dark";
  body.setAttribute("data-theme", isDark ? "light" : "dark");
  darkModeToggle.textContent = isDark ? "☀️" : "🌙";
});

// ============ SCROLL KE FORM ============
function scrollToForm() {
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
}

// ============ ANIMASI FADE-IN SAAT SCROLL ============
const fadeInElements = document.querySelectorAll(".court-card, .testi-card, .booking-form");

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.1 });

fadeInElements.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  fadeInObserver.observe(el);
});

// ============ FORM SUBMISSION + EMAILJS + WHATSAPP ============
document.getElementById("bookingForm").addEventListener("submit", function (e) {
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
    notes: form.notes.value.trim() || "Tidak ada catatan",
  };

  // Validasi sederhana
  if (!formData.name || !formData.email || !formData.court || !formData.date || !formData.timeStart || !formData.timeEnd) {
    alert("Mohon lengkapi semua field yang wajib diisi!");
    return;
  }

  // Format tanggal ke bahasa Indonesia
  const dateFormatted = new Date(formData.date).toLocaleDateString("id-ID", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
    alert("✅ Booking berhasil! Cek email Anda untuk konfirmasi.");

    // Buka WhatsApp dengan pesan yang lebih efektif (tidak terlalu panjang)
    const waNumber = "6282120843622"; // Nomor admin yang Anda berikan
    const waMessage = encodeURIComponent(
      `Halo Raketin! Saya ${formData.name} baru saja booking:\n` +
      `🏸 ${formData.court}\n` +
      `📅 ${dateFormatted}\n` +
      `⏰ ${formData.timeStart} - ${formData.timeEnd}\n\n` +
      `Sudah dapat email konfirmasi. Terima kasih!`
    );
    
    // URL WhatsApp yang benar (tanpa spasi)
    const whatsappUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
    window.open(whatsappUrl, '_blank');

    // Reset form & kembalikan tombol
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  })
  .catch((error) => {
    // ❌ Gagal
    console.error("Gagal kirim email:", error);
    
    // Tampilkan pesan error lebih detail
    let errorMessage = "❌ Gagal mengirim konfirmasi.";
    if (error.text) {
      errorMessage += `\n${error.text}`;
    }
    errorMessage += "\nCoba lagi nanti.";
    
    alert(errorMessage);
    
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
});