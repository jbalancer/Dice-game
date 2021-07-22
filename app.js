// window.onload=function(){
//     var scores, scoresRound, activePlayer, dice, playGame;

//     scores=[0,0];
//     activePlayer=0;
//     scoresRound=0;
//     playGame=true;

//     document.getElementById('score-0').textContent='0';
//     document.getElementById('score-1').textContent='0';
//     document.getElementById('current-0').textContent='0';
//     document.getElementById('current-1').textContent='0';
//     document.querySelector('.dice').style.display='none';

//     document.querySelector('.btn-roll').addEventListener('click',function(){
//         dice=Math.floor(Math.random()*6+1);
//         var diceDom=document.querySelector('.dice');
//         diceDom.style.display='block';
//         diceDom.src=`dice-${dice}.png`;
//         if(dice!==1){
//             scoresRound+=dice;
//             document.getElementById(`current-${activePlayer}`).textContent=scoresRound;
//         }else{
//             (activePlayer===0){
//                 activePlayer=1;
//             }else{
//                 activePlayer=0;
//             }
//             scoresRound=0;
//             document.querySelector('dice').style.display='none';
//             document.querySelector('.player-0-panel').classList.toggle('active');
//             document.querySelector('.player-0-panel').classList.toggle('active');
//             document.getElementById('current-0').textContent='0';
//             document.getElementById('current-1').textContent='0';
//         }
//     })

//     document.querySelector('.btn-hold').addEventListener('click',function(){
//         scores[activePlayer]+=scoresRound;
//         document.getElementById(`score-${activePlayer}`).textContent=scores[activePlayer];
//         if(scores[activePlayer]>=30){
//             document.getElementById(`name-`)
//         }
//     })
// }

class Game
{
	constructor(data)
	{
		this.maxScore = data.maxScore;
		this.turn = this.getRand(0, 1);
		this.state = true;
		this.players = [
			{
				name: data.playersName[0],
				score: {
					current: 0,
					exist: 0
				},
				winner: false
			},
			{
				name: data.playersName[1],
				score: {
					current: 0,
					exist: 0
				},
				winner: false
			}
		];
	}

	getRand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	existScore()
	{		
		if ( this.state )
		{
			this.players[this.turn].score.exist += this.players[this.turn].score.current;

			this.players[this.turn].score.current = 0;

			if ( this.players[this.turn].score.exist >= this.maxScore )
			{
				this.players[this.turn].winner = true;

				this.state = false;
			}

			return {
				idx: this.turn,
				current: this.players[this.turn].score.current,
				exist: this.players[this.turn].score.exist,
				state: this.players[this.turn].winner,
				game: true
			};
		}
		else
		{
			return {
				game: this.state
			};
		}
	}

	twistCube()
	{
		if ( this.state )
		{
			let
				sideNum = this.getRand(1, 6),
				curTurn = this.turn;
			
			if ( sideNum != 1 )
			{
				this.players[this.turn].score.current += sideNum;
			}
			else
			{
				this.players[this.turn].score.current = 0;
			}		

			if ( this.turn == 0 )
			{
				this.turn = 1;
			}
			else if( this.turn == 1 )
			{
				this.turn = 0;
			}

			return {
				num: sideNum,
				prevIdx: curTurn,
				nextIdx: this.turn,
				prev: this.players[curTurn].score.current,
				game: this.state
			};
		}
		else
		{
			return {
				game: this.state
			};
		}
	}

	getWinner()
	{
		let
			winnerPlayer;

		this.players.forEach(function(item) {

			if ( item.winner )
			{
				winnerPlayer = item.name;
			}

		});

		return winnerPlayer;
	}
}

var
	startNewGame  = document.querySelector('.btn-new'),
	castImitation = document.querySelector('.btn-roll'),
	savePoint     = document.querySelector('.btn-hold'),
	playerFirst   = document.getElementById('name-0'),
	playerSecond  = document.getElementById('name-1'),
	existFirst    = document.getElementById('score-0'),
	existSecond   = document.getElementById('score-1'),
	scoreFirst    = document.getElementById('current-0'),
	scoreSecond	  = document.getElementById('current-1'),
	playerPanel   = document.getElementsByClassName('player_panel'),
	cube          = document.querySelector('.cube'),
	currentGame,
	cubeTwisted   = false;

startNewGame.addEventListener('click', function() {

	let
		maxScore,
		players  = [];

	do
	{
		maxScore = parseInt(prompt('Кол-во очков для победы'));
	}
	while ( !maxScore );

	for (let i = 0; i < 2; i++)
	{
		let
			turn = i + 1,
			curPlayerName = prompt('Имя ' + turn + '-го игрока');

		if ( curPlayerName.trim() == '' )
		{
			curPlayerName = 'Player ' + turn;
		}

		players.push(curPlayerName);
	}

	currentGame = new Game({
		maxScore: maxScore,
		playersName: players
	});

	playerFirst.innerText = players[0];
	playerSecond.innerText = players[1];
	existFirst.innerText = 0;
	existSecond.innerText = 0;
	scoreFirst.innerText = 0;
	scoreSecond.innerText = 0;
	playerPanel[0].classList.remove('active');
	playerPanel[1].classList.remove('active');

	playerPanel[0].classList.remove('winner');
	playerPanel[1].classList.remove('winner');

	playerPanel[currentGame.turn].classList.add('active');

});

castImitation.addEventListener('click', playGame);
savePoint.addEventListener('click', playGame);

function playGame(e)
{
	if ( currentGame && !cubeTwisted )
	{
		let
			rotateCube,
			existScore;

		if ( e.target == castImitation )
		{
			rotateCube = currentGame.twistCube();
		}
		else if ( e.target == savePoint )
		{
			existScore = currentGame.existScore();
		}

		if ( rotateCube && rotateCube.game )
		{
			cubeTwisted = true;

			for (var i = 1; i < 7; i++)
			{
				cube.classList.remove('num-' + i);
			}

			cube.classList.add(('num-' + rotateCube.num), 'twist');

			setTimeout(function() {

				cubeTwisted = false;

				cube.classList.remove('twist');

				playerPanel[rotateCube.prevIdx].querySelector('#current-' + rotateCube.prevIdx).innerText = rotateCube.prev;
				playerPanel[rotateCube.prevIdx].classList.remove('active');

				playerPanel[rotateCube.nextIdx].classList.add('active');

			}, 3000);
		}
		else if ( existScore && existScore.game )
		{
			playerPanel[existScore.idx].querySelector('#current-' + existScore.idx).innerText = existScore.current;
			playerPanel[existScore.idx].querySelector('#score-' + existScore.idx).innerText = existScore.exist;

			if ( existScore.state )
			{
				playerPanel[existScore.idx].classList.add('winner');

				alert('Игра окончена! Победитель: "' + currentGame.getWinner() + '"!');
			}
		}
		else
		{
			alert('Игра окончена! Победитель: "' + currentGame.getWinner() + '"!');
		}
	}
	else if ( cubeTwisted )
	{
		alert('Подождите ...!');
	}
	else
	{
		alert('Начните новую игру!');
	}
}