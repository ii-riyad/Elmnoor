(function(){
  const ENDPOINT = '/send.php/send.php';
  async function sendEmail(formData){
    const resp = await fetch(ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    const data = await resp.json().catch(() => ({}));
    return { ok: resp.ok, data };
  }
  window.EmailSender = { sendEmail, ENDPOINT };
})();