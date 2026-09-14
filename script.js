(function () {
  "use strict";

  /* ---------- Menu mobile ---------- */
  var menuBtn = document.getElementById("btn-menu");
  var nav = document.getElementById("mainnav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* ---------- Alto contraste ---------- */
  var btnContraste = document.getElementById("btn-contraste");
  if (btnContraste) {
    btnContraste.addEventListener("click", function () {
      var ativo = document.body.classList.toggle("alto-contraste");
      btnContraste.setAttribute("aria-pressed", String(ativo));
    });
  }

  /* ---------- Texto grande ---------- */
  var btnTexto = document.getElementById("btn-texto");
  if (btnTexto) {
    btnTexto.addEventListener("click", function () {
      var ativo = document.documentElement.classList.toggle("texto-grande");
      btnTexto.setAttribute("aria-pressed", String(ativo));
    });
  }

  /* ---------- Slots de imagem: mostra a foto real quando ela existir ---------- */
  var slotImgs = document.querySelectorAll(".img-slot__img");
  slotImgs.forEach(function (img) {
    function marcarComoCarregada() {
      var slot = img.closest(".img-slot");
      if (slot) slot.classList.add("has-image");
    }
    if (img.complete && img.naturalWidth > 0) {
      // a imagem já veio do cache do navegador antes do JS rodar
      marcarComoCarregada();
    } else {
      img.addEventListener("load", marcarComoCarregada);
      img.addEventListener("error", function () {
        // sem arquivo ainda: mantém a caixa de placeholder visível
      });
    }
  });

  /* ---------- Disco de Newton: girar até "branco" ---------- */
  var disco = document.getElementById("newton-disc");
  var btnGirar = document.getElementById("btn-girar");
  var status = document.getElementById("disc-status");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (disco && btnGirar) {
    var girando = false;
    btnGirar.addEventListener("click", function () {
      girando = !girando;
      disco.classList.toggle("is-spinning", girando);
      btnGirar.textContent = girando ? "Parar rotação" : "Acelerar rotação";
      if (status) {
        status.textContent = girando
          ? (reduceMotion
              ? "Disco em modo de movimento reduzido: exibindo diretamente o resultado — branco."
              : "Disco girando em alta velocidade. As sete cores se misturam visualmente em branco.")
          : "Disco parado. As sete cores estão visíveis separadamente.";
      }
    });
  }

  /* ---------- Simulador de aquecimento solar ---------- */
  var form = document.getElementById("simulador-form");
  if (form) {
    var irr = document.getElementById("irradiancia");
    var irrOut = document.getElementById("irradiancia-out");
    var area = document.getElementById("area");
    var areaOut = document.getElementById("area-out");
    var tempo = document.getElementById("tempo");
    var tempoOut = document.getElementById("tempo-out");
    var volume = document.getElementById("volume");
    var volumeOut = document.getElementById("volume-out");
    var resultado = document.getElementById("resultado");
    var resultadoHelp = document.getElementById("resultado-help");

    function syncOutputs() {
      irrOut.textContent = irr.value + " W/m²";
      areaOut.textContent = area.value + " m²";
      tempoOut.textContent = tempo.value + " h";
      volumeOut.textContent = volume.value + " m³";
    }
    [irr, area, tempo, volume].forEach(function (el) {
      el.addEventListener("input", syncOutputs);
    });
    syncOutputs();

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var I = parseFloat(irr.value);           // W/m²
      var A = parseFloat(area.value);           // m²
      var t = parseFloat(tempo.value) * 3600;   // horas -> segundos
      var V = parseFloat(volume.value);         // m³
      var alphaEl = form.querySelector('input[name="superficie"]:checked');
      var alpha = parseFloat(alphaEl.value);

      var massa = V * 1000;      // kg (água)
      var c = 4186;               // J/(kg·K)

      var Q = I * A * alpha * t;  // Joules absorvidos (modelo simplificado, sem perdas)
      var deltaT = Q / (massa * c);

      resultado.textContent = "+" + deltaT.toFixed(1) + "°C";
      resultadoHelp.textContent =
        "Com irradiância de " + I + " W/m², coletor de " + A + " m², " +
        (t / 3600) + "h de exposição e " + V + " m³ de água, o modelo estima esse ganho de temperatura.";
    });
  }
})();
