document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("calcForm");
  let resultModalInstance = null;

  function formatNumber(num) {
    return Math.round(num).toLocaleString('ru-RU');
  }

  function getPercentByRating(rating) {
    if (rating >= 4.9 && rating <= 5) return 0.25;
    if (rating >= 4.7 && rating <= 4.8) return 0.10;
    if (rating >= 4.5 && rating <= 4.6) return 0;
    if (rating >= 4.3 && rating <= 4.4) return -0.05;
    if (rating >= 4.0 && rating <= 4.2) return -0.10;
    if (rating >= 3.5 && rating <= 3.9) return -0.30;
    if (rating < 3.5) return -0.50;
    return 0;
  }

  function validate(input, isRating = false) {
    input.classList.remove("error");
    const value = input.value;

    if (!value) {
      // alert("Заполните поле");
      input.classList.add("error");
      return false;
    }

    if (isRating) {
      if (isNaN(value) || value <= 0) {
        alert("Неправильный формат числа");
        input.classList.add("error");
        return false;
      }
    } else {
      if (!/^\d+$/.test(value)) {
        alert("Неправильный формат числа");
        input.classList.add("error");
        return false;
      }
    }

    return true;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

    const patientsInput = document.getElementById("patients");
    const avgCheckInput = document.getElementById("avgCheck");
    const ratingInput = document.getElementById("rating");
    const totalReviewsInput = document.getElementById("totalReviews");
    const negativeReviewsInput = document.getElementById("negativeReviews");

    const inputs = [
      patientsInput,
      avgCheckInput,
      totalReviewsInput,
      negativeReviewsInput
    ];

    for (let input of inputs) {
      if (!validate(input)) return;
    }

    if (!validate(ratingInput, true)) return;

    const patients = parseInt(patientsInput.value);
    const avgCheck = parseInt(avgCheckInput.value);
    const rating = parseFloat(ratingInput.value);
    const totalReviews = parseInt(totalReviewsInput.value);
    const negativeReviews = parseInt(negativeReviewsInput.value);

    let resultPatients = Math.round(patients * getPercentByRating(rating));

    resultPatients -= (negativeReviews * 1);

    if (totalReviews < 10) {
      resultPatients -= Math.round(patients * 0.05);
    }

    const money = Math.round(resultPatients * avgCheck);
    const moneyYear = money * 12;

    const resultLosses = document.getElementById("resultLosses");
    const resultGood = document.getElementById("resultGood");

    const growthLossState = document.getElementById("growth-loss-state");
    const growthGoodState = document.getElementById("growth-good-state");

    const btnLossState = document.getElementById("btn-loss-state");
    const btnGoodState = document.getElementById("btn-good-state");

    if (money < 0) {
      const ptPct = Math.min(100, Math.abs(resultPatients) / 50 * 100);
      const moPct = Math.min(100, Math.abs(money) / 500000 * 100);
      const yrPct = Math.min(100, Math.abs(moneyYear) / 5000000 * 100);

      document.getElementById("loss-pt").textContent = formatNumber(Math.abs(resultPatients));
      document.getElementById("loss-mo").textContent = formatNumber(Math.abs(money));
      document.getElementById("loss-yr").textContent = formatNumber(Math.abs(moneyYear));

      document.getElementById("prog-pt").style.setProperty('--bar-width', ptPct + '%');
      document.getElementById("prog-mo").style.setProperty('--bar-width', moPct + '%');
      document.getElementById("prog-yr").style.setProperty('--bar-width', yrPct + '%');

      resultLosses.style.display = "block";
      resultGood.style.display = "none";

      growthLossState.style.display = "block";
      growthGoodState.style.display = "none";

      btnLossState.style.display = "flex";
      btnGoodState.style.display = "none";
    } else {
      document.getElementById("gain-mo").textContent = formatNumber(money);

      resultLosses.style.display = "none";
      resultGood.style.display = "block";

      growthLossState.style.display = "none";
      growthGoodState.style.display = "block";

      btnLossState.style.display = "none";
      btnGoodState.style.display = "flex";
    }

    if (!resultModalInstance) {
      resultModalInstance = new bootstrap.Modal(document.getElementById('resultModal'));
    }
    resultModalInstance.show();
    });
  }

  // Back to top button functionality
  const backBtn = document.querySelector('.back-btn');
  const backBtnWrapper = document.querySelector('.back-btn-wrapper');
  const competitorSection = document.querySelector('.revenue-loss');

  if (backBtn && competitorSection) {
    window.addEventListener('scroll', function () {
      const sectionTop = competitorSection.getBoundingClientRect().top + window.scrollY;
      
      // Appear when approaching competitor-section
      if (window.scrollY >= sectionTop - 400) {
        backBtn.classList.add('show');
      } else {
        backBtn.classList.remove('show');
      }
    });
  }

  // Bind click event to the wrapper for better UX as requested
  if (backBtnWrapper) {
    backBtnWrapper.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Swiper for reputation-section on mobile
  let reputationSwiper = null;

  function initReputationSwiper() {
    const isMobile = window.innerWidth <= 768;
    const swiperContainer = document.querySelector('.reputation-swiper');

    if (swiperContainer) {
      if (isMobile) {
        if (!reputationSwiper) {
          reputationSwiper = new Swiper('.reputation-swiper', {
            slidesPerView: 1.2,
            spaceBetween: 15,

            pagination: {
              el: '.reputation-pagination',
              clickable: true,
            },
          });
        }
      } else {
        if (reputationSwiper) {
          reputationSwiper.destroy(true, true);
          reputationSwiper = null;
        }
      }
    }
  }

  initReputationSwiper();
  window.addEventListener('resize', initReputationSwiper);

  // Swiper for growth-results
  let growthResultsSwiper = null;

  function initGrowthSwiper() {
    const swiperContainer = document.querySelector('.growth-results-swiper');
    if (swiperContainer) {
      if (!growthResultsSwiper) {
        growthResultsSwiper = new Swiper('.growth-results-swiper', {
          spaceBetween: 20,
          watchOverflow: true,
          pagination: {
            el: '.growth-results-pagination',
            clickable: true,
          },
          breakpoints: {
            0: {
              slidesPerView: 1,
            },
            480: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            }
          }
        });
      }
    }
  }

  initGrowthSwiper();
});

// New Revenue Calculator Logic
document.addEventListener("DOMContentLoaded", function () {
  const revenueForm = document.getElementById("revenueCalcForm");
  if (!revenueForm) return;

  revenueForm.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateRevenue();
  });

  function calculateRevenue() {
    // Получаем значения из полей ввода
    const leads = parseFloat(document.getElementById('leads').value);
    const averageCheck = parseFloat(document.getElementById('averageCheck').value);
    const conversion = parseFloat(document.getElementById('conversion').value);

    const resultElement = document.getElementById('result');
    const newResultContent = document.getElementById('newResultContent');
    const oldResultLosses = document.getElementById('resultLosses');
    const oldResultGood = document.getElementById('resultGood');
    const oldBtnBlock = document.querySelector('.resultStatus_btn__block');

    // Проверяем, что все значения являются числами
    if (isNaN(leads) || isNaN(averageCheck) || isNaN(conversion)) {
      resultElement.innerHTML = '<span style="color: red;">Ошибка: все поля должны содержать числа!</span>';
      showModal();
      return;
    }

    // Переводим конверсию из процентов в доли (например, 20% → 0.2)
    const conversionRate = conversion / 100;

    // 1. Текущая выручка: количество заявок × конверсия × средний чек
    const currentRevenue = leads * conversionRate * averageCheck;

    // Количество пациентов: количество заявок × конверсия
    const patientsCount = leads * conversionRate;

    // 2. Возможная выручка: оптимизация до 60% (согласно дизайну)
    const potentialRevenue = leads * 0.6 * averageCheck;

    // 3. Дополнительная выручка: разница между возможной и текущей выручкой
    const additionalRevenue = Math.max(0, potentialRevenue - currentRevenue);

    // Заполняем данные текущей выручки
    document.getElementById('val-conversion').textContent = conversion;
    document.getElementById('val-patients').textContent = Math.round(patientsCount);
    document.getElementById('val-current-rev').textContent = Math.round(currentRevenue).toLocaleString('ru-RU');

    // Если конверсия 60% и более, показываем специальное сообщение, так как "до 60%" уже достигнуто
    if (conversion >= 60) {
      document.getElementById('row-special').style.display = 'block';
      document.getElementById('row-potential').style.display = 'none';
      document.getElementById('row-additional').style.display = 'none';
    } else {
      document.getElementById('row-special').style.display = 'none';

      document.getElementById('val-potential-rev').textContent = Math.round(potentialRevenue).toLocaleString('ru-RU');
      document.getElementById('val-additional-rev').textContent = Math.round(additionalRevenue).toLocaleString('ru-RU');

      document.getElementById('row-potential').style.display = 'block';
      document.getElementById('row-additional').style.display = 'block';
    }

    // Hide old content, show new content
    if (oldResultLosses) oldResultLosses.style.display = 'none';
    if (oldResultGood) oldResultGood.style.display = 'none';
    if (oldBtnBlock) oldBtnBlock.style.display = 'none';
    if (newResultContent) newResultContent.style.display = 'block';

    showModal();
  }

  function showModal() {
    const modalEl = document.getElementById('resultModal');
    let modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalEl);
    }
    modalInstance.show();
  }
});
