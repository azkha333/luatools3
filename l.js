function runLua() {
  const kode = document.getElementById("inputLua").value;
  const output = document.getElementById("output");

  try {
    output.textContent = "";

    fengari.load(`
      io.write = function(s) js.global:print(s) end
      print = function(...) io.write(table.concat({...}, "\\t") .. "\\n") end
      ${kode}
    `)();
  } catch (e) {
    output.textContent = `❌ Error:\n${e.message}`;
  }
}

function copyCode() {
  const code = document.getElementById("inputLua").value;
  navigator.clipboard.writeText(code).then(() => {
    alert("Kode berhasil disalin!");
  });
}

window.print = function(s) {
  const output = document.getElementById("output");
  output.textContent += s;
};

function autoFix() {
  let code = document.getElementById("inputLua").value;

  // Tambahkan "then" untuk baris if yang tidak punya
  code = code.split('\n').map(line => {
    if (line.trim().match(/^if .+/) && !line.includes("then")) {
      return line + " then";
    }
    return line;
  }).join('\n');

  // Ganti = jadi == di dalam kondisi if
  code = code.replace(/if\s+(.*[^=])=([^=].*)\s+then/g, "if $1==$2 then");

  // Tambahkan end jika jumlah tidak seimbang
  const blockOpen = (code.match(/\b(if|function|do)\b/g) || []).length;
  const blockClose = (code.match(/\bend\b/g) || []).length;
  const diff = blockOpen - blockClose;
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      code += "\nend";
    }
  }

  document.getElementById("inputLua").value = code;
  alert("Perbaikan otomatis selesai! Silakan jalankan ulang.");
}
