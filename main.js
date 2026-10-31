/**
 * श्री गौ मंदिर गौशाला — मुख्य जावास्क्रिप्ट एवं इंटरैक्टिव कार्यप्रणाली
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. नेविगेशन एवं हेडर स्क्रॉल
  // ---------------------------------------------------------------------------
  const header = document.getElementById('site-header');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  // स्क्रॉल पर हेडर को चिपचिपा (sticky) बनाना
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // मोबाइल मेन्यू खोलना / बंद करना
  const openMobileMenu = () => {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openMobileMenu);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  // बैकड्रॉप पर क्लिक करने से मेन्यू बंद हो
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeMobileMenu();
      }
    });
  }

  // लिंक पर क्लिक करने पर मेन्यू स्वतः बंद हो
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // स्क्रॉल के आधार पर सक्रिय नेविगेशन लिंक हाइलाइट
  const sections = document.querySelectorAll('section[id], header[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href').replace('#', '');
          if (href === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));

  // शीर्ष पर जाएँ (Back to top) बटन
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------------------------------------------------------------------------
  // 2. दान एवं सेवा संकल्प इंटरएक्टिविटी
  // ---------------------------------------------------------------------------
  const freqButtons = document.querySelectorAll('.freq-btn');
  const donationCards = document.querySelectorAll('.donation-card');
  const presetButtons = document.querySelectorAll('.preset-btn');
  const customDonationInput = document.getElementById('custom-donation-input');
  const btnSubmitDonation = document.getElementById('btn-submit-donation');
  const selectTierButtons = document.querySelectorAll('.donation-card .btn');

  // मोडल अवयव
  const donationModal = document.getElementById('donation-modal');
  const donationModalClose = document.getElementById('donation-modal-close');
  const donationModalAck = document.getElementById('donation-modal-ack');
  const modalSevaName = document.getElementById('modal-seva-name');
  const modalSevaAmt = document.getElementById('modal-seva-amt');
  const modalSevaFreq = document.getElementById('modal-seva-freq');

  let currentFrequency = 'एकमुश्त सेवा अर्पण';

  // आवृत्ति टॉगल (एकमुश्त बनाम मासिक)
  freqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      freqButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isMonthly = btn.getAttribute('data-freq') === 'monthly';
      currentFrequency = isMonthly ? 'मासिक गौ पालक सेवा (नियमित सेवा)' : 'एकमुश्त सेवा अर्पण';

      // कार्डों पर मूल्य अवधि अद्यतन करें
      donationCards.forEach(card => {
        const periodEl = card.querySelector('.price-period');
        if (periodEl) {
          periodEl.textContent = isMonthly ? '/ माह' : '/ सेवा';
        }
      });

      showToast('सेवा आवृत्ति बदली गई', `चयनित: ${currentFrequency}`, '🌱');
    });
  });

  // पूर्व-निर्धारित राशि बटन
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const amount = btn.getAttribute('data-amt');
      if (customDonationInput) {
        customDonationInput.value = amount;
      }
    });
  });

  if (customDonationInput) {
    customDonationInput.addEventListener('input', () => {
      const val = customDonationInput.value;
      presetButtons.forEach(b => {
        if (b.getAttribute('data-amt') === val) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    });
  }

  // दान मोडल खोलना
  const openDonationModal = (sevaName, amount) => {
    const formattedAmount = parseInt(amount, 10).toLocaleString('hi-IN');
    if (modalSevaName) modalSevaName.textContent = sevaName;
    if (modalSevaAmt) modalSevaAmt.textContent = `₹${formattedAmount}`;
    if (modalSevaFreq) modalSevaFreq.textContent = currentFrequency;

    if (donationModal) {
      donationModal.classList.add('open');
      donationModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDonationModal = () => {
    if (donationModal) {
      donationModal.classList.remove('open');
      donationModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (donationModalClose) donationModalClose.addEventListener('click', closeDonationModal);
  if (donationModalAck) donationModalAck.addEventListener('click', () => {
    closeDonationModal();
    showToast('प्रोटोटाइप सूचना', 'क्लाइंट की अंतिम स्वीकृति के बाद भुगतान गेटवे सक्रिय किया जाएगा।', '✅');
  });

  if (donationModal) {
    donationModal.addEventListener('click', (e) => {
      if (e.target === donationModal) closeDonationModal();
    });
  }

  // टियर बटन क्लिक
  selectTierButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tierName = btn.getAttribute('data-tier-name') || 'गौ सेवा अंशदान';
      const amount = btn.getAttribute('data-amount') || '1100';
      openDonationModal(tierName, amount);
    });
  });

  // स्वेच्छा अंशदान सबमिट
  if (btnSubmitDonation) {
    btnSubmitDonation.addEventListener('click', (e) => {
      e.preventDefault();
      const amount = customDonationInput ? parseInt(customDonationInput.value, 10) : 1100;
      if (isNaN(amount) || amount < 100) {
        showToast('अमान्य राशि', 'कृपया ₹100 या उससे अधिक की वैध राशि दर्ज करें।', '⚠️');
        return;
      }
      openDonationModal('स्वेच्छा गौ सेवा संकल्प', amount);
    });
  }

  // ---------------------------------------------------------------------------
  // 3. गैलरी फ़िल्टरिंग एवं लाइटबॉक्स पॉपअप
  // ---------------------------------------------------------------------------
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');

  // फ़िल्टर टैब
  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // लाइटबॉक्स क्लिक
  const openLightbox = (imgSrc, title, tag, desc) => {
    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTag) lightboxTag.textContent = tag;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    if (lightboxModal) {
      lightboxModal.classList.add('open');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  galleryItems.forEach(item => {
    const handleTrigger = () => {
      const img = item.querySelector('.gallery-img');
      const titleEl = item.querySelector('.gallery-item-title');
      const tagEl = item.querySelector('.gallery-item-category');
      const descEl = item.querySelector('.gallery-item-desc');

      if (img && titleEl) {
        openLightbox(
          img.src,
          titleEl.textContent,
          tagEl ? tagEl.textContent : 'अभयारण्य जीवन',
          descEl ? descEl.textContent : ''
        );
      }
    };

    item.addEventListener('click', handleTrigger);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrigger();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // ---------------------------------------------------------------------------
  // 4. गतिविधि विस्तृत विवरण मोडल
  // ---------------------------------------------------------------------------
  const activityModal = document.getElementById('activity-modal');
  const activityModalClose = document.getElementById('activity-modal-close');
  const activityModalCloseBtn = document.getElementById('activity-modal-close-btn');
  const activityModalTitle = document.getElementById('activity-modal-title');
  const activityModalSubtitle = document.getElementById('activity-modal-subtitle');
  const activityModalBody = document.getElementById('activity-modal-body');
  const activityModalIcon = document.getElementById('activity-modal-icon');
  const activityModalSupportBtn = document.getElementById('activity-modal-support-btn');

  const activityData = {
    feeding: {
      icon: '🌾',
      title: 'दैनिक पोषण एवं ग्रास सेवा',
      subtitle: 'सैकड़ों गौवंश को नित्य संतुलित, पौष्टिक और ताज़ा आहार',
      content: `
        <p style="margin-bottom: 12px; font-size: 0.95rem; color: #5C635E; line-height: 1.6;">
          श्री गौ रक्षणी सभा प्राचीन गौशाला, लुधियाना में प्रत्येक गौमाता व नंदी के उत्तम स्वास्थ्य हेतु प्रतिदिन संतुलित आहार वितरित किया जाता है।
        </p>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 16px 0; font-size: 0.9rem; color: #1B3B2B;">
          <li><strong>• ताज़ा हरा चारा व सूखा भूसा:</strong> प्रतिदिन सुबह-शाम पर्याप्त मात्रा में स्वच्छ हौदों में वितरण।</li>
          <li><strong>• शुद्ध गुड़ व पौष्टिक चोकर:</strong> गौवंश के पाचन, ऊर्जा व प्रसन्नता हेतु विशेष आहार।</li>
          <li><strong>• मिनरल साल्ट ब्लॉक:</strong> गौवंश की हड्डियों, खुरों और रोग-प्रतिरोधक क्षमता हेतु खनिज लवण शिलाएँ।</li>
          <li><strong>• स्वच्छ शीतल जल:</strong> पक्के जल कुंडों में अनवरत स्वच्छ पेय जल की व्यवस्था।</li>
        </ul>
        <div style="background: #FDF1E6; padding: 12px; border-radius: 8px; font-size: 0.85rem; color: #7A4F36; border: 1px dashed #D97724;">
          <strong>सेवा अवसर:</strong> अपने जन्मदिन, वैवाहिक वर्षगांठ अथवा पूर्वजों की पुण्यतिथि पर ग्रास दान कर विशेष पुण्य अर्जित करें।
        </div>
      `
    },
    veterinary: {
      icon: '🩺',
      title: 'बीमार गऊओं का हस्पताल (वार्ड नं. 7)',
      subtitle: 'प्राचीन गौशाला, लुधियाना — अस्वस्थ व घायल गौवंश की समर्पित चिकित्सा',
      content: `
        <p style="margin-bottom: 12px; font-size: 0.95rem; color: #5C635E; line-height: 1.6;">
          गौशाला परिसर में विशेष रूप से सुसज्जित चिकित्सालय एवं वार्ड स्थापित है जहाँ दुर्घटनाग्रस्त, बीमार व वृद्ध गौवंश का निःशुल्क उपचार किया जाता है।
        </p>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 16px 0; font-size: 0.9rem; color: #1B3B2B;">
          <li><strong>• समर्पित वार्ड नं. 7:</strong> बीमार व घायल गायों के लिए शांत, स्वच्छ व विशेष देखभाल वार्ड।</li>
          <li><strong>• नियमित घाव ड्रेसिंग व दवा:</strong> एंटीसेप्टिक मरहम-पट्टी, दर्द निवारक व स्वास्थ्यवर्धक टॉनिक।</li>
          <li><strong>• अनुभवी पशु चिकित्सकों की देखरेख:</strong> समय-समय पर स्वास्थ्य जाँच एवं आवश्यक उपचार।</li>
          <li><strong>• वृद्ध गायों की सेवा:</strong> चलने-फिरने में असमर्थ गायों के लिए विशेष सेवा व कोमल पुआल शैया।</li>
        </ul>
      `
    },
    shelter: {
      icon: '🏡',
      title: 'विशाल हवादार शेड एवं नंदी संरक्षण',
      subtitle: 'पंखों की सुविधा, पक्के फर्श एवं स्वच्छ सुरक्षित वातावरण',
      content: `
        <p style="margin-bottom: 12px; font-size: 0.95rem; color: #5C635E; line-height: 1.6;">
          गौ माता और नंदी बैलों के अनुकूल रहने हेतु ऊँचे स्तंभों और उत्तम वायु-संचार वाले विशाल पक्के शेड बनाए गए हैं।
        </p>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 16px 0; font-size: 0.9rem; color: #1B3B2B;">
          <li><strong>• विद्युत पंखों की व्यवस्था:</strong> ग्रीष्म ऋतु में गर्मी से बचाव हेतु कतारबद्ध पंखे।</li>
          <li><strong>• पक्के फर्श व उत्तम जल निकासी:</strong> शेड को सूखा, स्वच्छ व दुर्गंधमुक्त रखने हेतु नियमित धुलाई।</li>
          <li><strong>• नंदी बैलों हेतु पृथक बाड़े:</strong> तेजस्वी नंदी, बछड़ों व माताओं के लिए सुरक्षित खंड।</li>
          <li><strong>• प्राकृतिक व शांत परिवेश:</strong> प्रदूषण मुक्त, सुरक्षित एवं धार्मिक वातावरण।</li>
        </ul>
      `
    },
    community: {
      icon: '🕊️',
      title: 'पक्षी बचाओ जीवन बचाओ एवं सत्संग केंद्र',
      subtitle: 'विशाल पक्षी सेवा अभयारण्य, अभिषेक चोपड़ा सत्संग हॉल एवं गो-पूजन',
      content: `
        <p style="margin-bottom: 12px; font-size: 0.95rem; color: #5C635E; line-height: 1.6;">
          प्राचीन गौशाला, लुधियाना में गौ सेवा के साथ-साथ मूक पक्षियों की सेवा एवं आध्यात्मिक सत्संग का अद्वितीय संगम है।
        </p>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 16px 0; font-size: 0.9rem; color: #1B3B2B;">
          <li><strong>• "पक्षी बचाओ जीवन बचाओ" प्रकल्प:</strong> छत पर विशाल पक्षी दाना-पानी केंद्र जहाँ प्रतिदिन हज़ारों कबूतर व पक्षी आते हैं।</li>
          <li><strong>• जल फव्वारा व शीतल कुंड:</strong> मूक पक्षियों के स्नान व ग्रीष्म में जलपान हेतु विशेष फव्वारा कुंड।</li>
          <li><strong>• अभिषेक चोपड़ा सत्संग हॉल:</strong> धार्मिक सत्संग, भजन-कीर्तन व सामाजिक-धार्मिक सभाओं का भव्य स्थल।</li>
          <li><strong>• गौ दान व गौ पूजन:</strong> श्रद्धालु परिजनों द्वारा वैदिक मंत्रोच्चार के साथ नित्य गो-पूजन व गो-दान।</li>
        </ul>
      `
    }
  };

  const openActivityModal = (key) => {
    const data = activityData[key];
    if (!data) return;

    if (activityModalIcon) activityModalIcon.textContent = data.icon;
    if (activityModalTitle) activityModalTitle.textContent = data.title;
    if (activityModalSubtitle) activityModalSubtitle.textContent = data.subtitle;
    if (activityModalBody) activityModalBody.innerHTML = data.content;

    if (activityModal) {
      activityModal.classList.add('open');
      activityModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeActivityModal = () => {
    if (activityModal) {
      activityModal.classList.remove('open');
      activityModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('.card-link-btn[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalKey = btn.getAttribute('data-modal');
      openActivityModal(modalKey);
    });
  });

  if (activityModalClose) activityModalClose.addEventListener('click', closeActivityModal);
  if (activityModalCloseBtn) activityModalCloseBtn.addEventListener('click', closeActivityModal);
  if (activityModalSupportBtn) {
    activityModalSupportBtn.addEventListener('click', () => {
      closeActivityModal();
    });
  }
  if (activityModal) {
    activityModal.addEventListener('click', (e) => {
      if (e.target === activityModal) closeActivityModal();
    });
  }

  // ---------------------------------------------------------------------------
  // 5. संपर्क व दर्शन योजना फॉर्म
  // ---------------------------------------------------------------------------
  const visitForm = document.getElementById('visit-form');
  const btnQuickInquiry = document.getElementById('btn-quick-inquiry');

  if (visitForm) {
    visitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('visit-name');
      const phoneInput = document.getElementById('visit-phone');

      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        showToast('आवश्यक जानकारी', 'कृपया अपना नाम और संपर्क फोन नंबर दर्ज करें।', '⚠️');
        return;
      }

      const visitorName = nameInput.value.trim();
      visitForm.reset();

      showToast(
        'दर्शन योजना प्राप्त हुई (डेमो)',
        `सादर धन्यवाद ${visitorName} जी! लाइव वेबसाइट में हमारे गौसेवक आपके स्वागत व दर्शन समन्वय हेतु संपर्क करेंगे।`,
        '🪷'
      );
    });
  }

  if (btnQuickInquiry) {
    btnQuickInquiry.addEventListener('click', () => {
      showToast(
        'ईमेल संपर्क सूचना (स्थानधारक)',
        'लाइव वेबसाइट पर यह सीधे seva@[client-gaushala-domain.org] को ईमेल प्रेषित करेगा।',
        '✉️'
      );
    });
  }

  // ---------------------------------------------------------------------------
  // 6. एस्केप की (Escape Key) हैंडलर
  // ---------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDonationModal();
      closeLightbox();
      closeActivityModal();
      closeMobileMenu();
    }
  });

  // ---------------------------------------------------------------------------
  // 7. टोस्ट सूचना यूटिलिटी (Toast Notification Utility)
  // ---------------------------------------------------------------------------
  function showToast(title, message, icon = 'ℹ️') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);

    // एनीमेशन शुरू करें
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // 4.5 सेकंड बाद हटाएँ
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }, 4500);
  }
});
