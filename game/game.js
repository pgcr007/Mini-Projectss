const emojis = ['🍎','🍎','🍌','🍌','🍒','🍒','🍇','🍇','🍉','🍉','🍍','🍍','🥝','🥝','🍓','🍓'];
let filppedcards = [];
let matchedcards = [];

function shuffle(array)
{
    for(let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createboard()
{
    const gameboard = document.getElementById('gameboard');
    const shuffledemojis = shuffle([...emojis]);

    shuffledemojis.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.addEventListener('click',flipcard);
        gameboard.appendChild(card);
    });
}

function flipcard()
{
    if(filppedcards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched'))
    {
        this.classList.add('flipped');
        this.textContent = this.dataset.emoji;
        filppedcards.push(this);

        if(filppedcards.length === 2)
        {
            checkmatch();
        }
    }
}

function checkmatch()
{
    const [card1, card2] = filppedcards;

    if(card1.dataset.emoji === card2.dataset.emoji)
    {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedcards.push(card1, card2);

        if(matchedcards.length === emojis.length)
        {
            setTimeout(() => alert('Congratulations! You won'), 500);
        }

    }
    else
    {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent  = '';
            card2.textContent = '';
        }, 1000);
    }

    filppedcards = [];
}

createboard();