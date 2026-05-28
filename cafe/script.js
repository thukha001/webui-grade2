// form 
function reserve() {
    const name = document.getElementById('guestName').value;
    const count = document.getElementById('guestCount').value;

    const result = document.getElementById('reserveResult');

    if (name === '' || count === '') {
        result.textContent = '入力してください';
        return;
    } else {
        result.textContent = `✓ ご予約ありがとうございます、${name}様。${count}名様で承りました。`;
    }
}

// recommend
function pickRecommend() {
    
}
