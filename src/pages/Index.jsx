import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Gift, Volume2, VolumeX, Zap, Settings, DollarSign, Sparkles, CreditCard, HelpCircle } from "lucide-react";
import { generateImage } from '@/lib/utils';
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PayTable from '../components/PayTable';
import LeaderBoard from '../components/LeaderBoard';
import BonusWheel from '../components/BonusWheel';
import DepositDialog from '../components/DepositDialog';
import HelpDialog from '../components/HelpDialog';
import SideBet from '../components/SideBet';

const Index = () => {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState([['🍒', '🍋', '🍇'], ['🍒', '🍋', '🍇'], ['🍒', '🍋', '🍇'], ['🍒', '🍋', '🍇'], ['🍒', '🍋', '🍇']]);
  const [spinning, setSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [jackpot, setJackpot] = useState(10000);
  const [jackpotTicker, setJackpotTicker] = useState(10000);
  const [sound, setSound] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);
  const [selectedGame, setSelectedGame] = useState('matrix');
  const [paylines, setPaylines] = useState(20);
  const [bonusProgress, setBonusProgress] = useState(0);
  const [turboMode, setTurboMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showBonusWheel, setShowBonusWheel] = useState(false);
  const [lastWin, setLastWin] = useState(null);
  const [multiplier, setMultiplier] = useState(1);
  const [freeSpins, setFreeSpins] = useState(0);

  const symbols = ['🍒', '🍋', '🍇', '🍊', '🍉', '💎', '7️⃣', '🃏', '🎰', '🌟'];
  const [games, setGames] = useState([
    { id: 'matrix', name: "Matrix Mayhem", image: null },
    { id: 'neon', name: "Neon Nights", image: null },
    { id: 'treasure', name: "Treasure Hunt", image: null },
    { id: 'space', name: "Space Odyssey", image: null },
  ]);

  useEffect(() => {
    const generateGameImages = async () => {
      const updatedGames = await Promise.all(games.map(async (game) => ({
        ...game,
        image: await generateImage(`${game.name} slot machine game, digital art style`)
      })));
      setGames(updatedGames);
    };
    generateGameImages();
  }, []);

  const spinReels = () => {
    if (freeSpins > 0) {
      setFreeSpins(prevFreeSpins => prevFreeSpins - 1);
    } else if (balance < bet) {
      alert("Insufficient balance!");
      return;
    } else {
      setBalance(prevBalance => prevBalance - bet);
    }

    setSpinning(true);
    setWinAmount(0);
    setLastWin(null);

    const newReels = reels.map(() =>
      Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)])
    );

    const spinDuration = turboMode ? 500 : 1000 / animationSpeed;

    setTimeout(() => {
      setReels(newReels);
      setSpinning(false);
      const win = checkWin(newReels);
      if (win > 0) {
        const totalWin = win * multiplier;
        setBalance(prevBalance => prevBalance + totalWin);
        setWinAmount(totalWin);
        setLastWin({ amount: totalWin, multiplier });
      }
      updateBonusProgress();
      checkForFreeSpins(newReels);
    }, spinDuration);
  };

  const checkForFreeSpins = (newReels) => {
    const scatterCount = newReels.flat().filter(symbol => symbol === '🃏').length;
    if (scatterCount >= 3) {
      const newFreeSpins = scatterCount * 5;
      setFreeSpins(prevFreeSpins => prevFreeSpins + newFreeSpins);
      setLastWin(prevWin => ({
        ...prevWin,
        freeSpins: newFreeSpins
      }));
    }
  };

  const checkWin = (newReels) => {
    let win = 0;
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (newReels[0][i] === newReels[1][i] && newReels[1][i] === newReels[2][i] && newReels[2][i] === newReels[3][i] && newReels[3][i] === newReels[4][i]) {
        win += bet * getMultiplier(newReels[0][i]) * 5; // 5x for all 5 reels
      } else if (newReels[0][i] === newReels[1][i] && newReels[1][i] === newReels[2][i] && newReels[2][i] === newReels[3][i]) {
        win += bet * getMultiplier(newReels[0][i]) * 2; // 2x for 4 reels
      } else if (newReels[0][i] === newReels[1][i] && newReels[1][i] === newReels[2][i]) {
        win += bet * getMultiplier(newReels[0][i]);
      }
    }
    // Check diagonals and other paylines...
    // (Add more complex win patterns here)

    if (win > 0) {
      setBalance(prevBalance => prevBalance + win);
      setWinAmount(win);
      if (win >= bet * 50) {
        triggerJackpot();
      }
    }
  };

  const getMultiplier = (symbol) => {
    switch (symbol) {
      case '🌟': return 100;
      case '🎰': return 50;
      case '🃏': return 25;
      case '💎': return 15;
      case '7️⃣': return 10;
      case '🍉': return 5;
      case '🍊': return 4;
      case '🍇': return 3;
      case '🍋': return 2;
      case '🍒': return 1;
      default: return 0;
    }
  };

  const triggerJackpot = () => {
    setBalance(prevBalance => prevBalance + jackpot);
    setWinAmount(prevWin => prevWin + jackpot);
    setJackpot(10000); // Reset jackpot
    // Add jackpot animation here
  };

  const updateBonusProgress = () => {
    setBonusProgress(prev => {
      const newProgress = prev + 5;
      if (newProgress >= 100) {
        triggerBonusGame();
        return 0;
      }
      return newProgress;
    });
  };

  const triggerBonusGame = useCallback(() => {
    setShowBonusWheel(true);
  }, []);

  useEffect(() => {
    if (bonusProgress >= 100) {
      triggerBonusGame();
      setBonusProgress(0);
    }
  }, [bonusProgress, triggerBonusGame]);

  const handleBonusWheelResult = (result) => {
    setBalance(prevBalance => prevBalance + result);
    setShowBonusWheel(false);
    setLastWin({ amount: result, multiplier: 1, type: 'bonus' });
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
    if (!autoPlay) {
      setAutoPlayCount(10); // Start with 10 auto spins
      runAutoPlay();
    }
  };

  const runAutoPlay = () => {
    if (autoPlayCount > 0 && balance >= bet) {
      spinReels();
      setAutoPlayCount(prev => prev - 1);
      setTimeout(runAutoPlay, 2000);
    } else {
      setAutoPlay(false);
    }
  };

  useEffect(() => {
    const jackpotInterval = setInterval(() => {
      setJackpot(prevJackpot => prevJackpot + Math.floor(Math.random() * 10) + 1);
    }, 1000);

    const tickerInterval = setInterval(() => {
      setJackpotTicker(prevTicker => {
        const diff = jackpot - prevTicker;
        return prevTicker + Math.ceil(diff / 10);
      });
    }, 100);

    return () => {
      clearInterval(jackpotInterval);
      clearInterval(tickerInterval);
    };
  }, [jackpot]);

  return (
    <div className="container mx-auto px-4 py-8" style={{backgroundImage: 'url("https://source.unsplash.com/random/1920x1080?matrix")', backgroundSize: 'cover', backgroundAttachment: 'fixed'}}>
      {lastWin && (
        <Alert className="mb-4 bg-green-500 text-white">
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Big Win!</AlertTitle>
          <AlertDescription>
            You won ${lastWin.amount} {lastWin.multiplier > 1 && `with a ${lastWin.multiplier}x multiplier`}
            {lastWin.type === 'bonus' && ' in the Bonus Game'}
            {lastWin.freeSpins && ` and ${lastWin.freeSpins} Free Spins!`}
          </AlertDescription>
        </Alert>
      )}
      <img src="https://source.unsplash.com/random/256x256?logo" alt="Matrix Slots Extravaganza" className="mx-auto mb-8 w-64 object-cover" />
      
      {/* Featured Promotion */}
      <Card className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Mega Welcome Package</h2>
            <p className="text-xl">Get 300% bonus up to $3000 + 100 Free Spins on your first 3 deposits!</p>
          </div>
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
            <Gift className="mr-2 h-5 w-5" />
            Claim Now
          </Button>
        </CardContent>
      </Card>

      {/* User Actions */}
      <div className="flex justify-end space-x-4 mb-4">
        <DepositDialog onDeposit={(amount) => setBalance(prevBalance => prevBalance + amount)} />
        <HelpDialog />
      </div>

      {/* Game Selection Tabs */}
      <Tabs defaultValue={selectedGame} onValueChange={setSelectedGame} className="mb-8">
        <TabsList className="grid w-full grid-cols-4 bg-black/50">
          {games.map(game => (
            <TabsTrigger key={game.id} value={game.id} className="text-white data-[state=active]:bg-purple-600">
              {game.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {games.map(game => (
          <TabsContent key={game.id} value={game.id}>
            <Card className="bg-black/50 text-white">
              <CardHeader>
                <CardTitle className="text-center text-3xl">{game.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {reels.map((reel, i) => (
                    <div key={i} className="bg-gray-800 p-2 rounded-lg">
                      {reel.map((symbol, j) => (
                        <div key={j} className="text-center mb-2 text-4xl">
                          {symbol}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-xl">Balance: ${balance}</div>
                  <div className="text-xl">Bet: ${bet}</div>
                  <div className="text-xl">Paylines: {paylines}</div>
                  {freeSpins > 0 && (
                    <div className="text-xl text-yellow-400">Free Spins: {freeSpins}</div>
                  )}
                </div>
                <div className="flex justify-center space-x-4 mb-6">
                  <Button onClick={() => setBet(Math.max(1, bet - 1))} variant="secondary">-</Button>
                  <Button onClick={() => setBet(Math.min(100, bet + 1))} variant="secondary">+</Button>
                  <Button onClick={() => setPaylines(Math.max(1, paylines - 1))} variant="secondary">-</Button>
                  <Button onClick={() => setPaylines(Math.min(25, paylines + 1))} variant="secondary">+</Button>
                </div>
                <div className="flex justify-between mb-6">
                  <Button 
                    onClick={spinReels} 
                    disabled={spinning || autoPlay} 
                    className="w-1/4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
                  >
                    {spinning ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-5 w-5" />
                    )}
                    {spinning ? 'Spinning...' : 'Spin'}
                  </Button>
                  <Button 
                    onClick={toggleAutoPlay}
                    className={`w-1/5 ${autoPlay ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    {autoPlay ? `Stop (${autoPlayCount})` : 'Auto Play'}
                  </Button>
                  <Button
                    onClick={() => setMultiplier(prevMultiplier => prevMultiplier < 5 ? prevMultiplier + 1 : 1)}
                    className="w-1/5 bg-purple-500 hover:bg-purple-600"
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    {`Multiplier: ${multiplier}x`}
                  </Button>
                  <PayTable />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => setSound(!sound)} variant="outline" className="w-12">
                          {sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{sound ? 'Mute' : 'Unmute'} game sounds</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-12">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 text-white">
                      <DialogHeader>
                        <DialogTitle>Game Settings</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="turbo-mode">Turbo Mode</Label>
                          <Switch
                            id="turbo-mode"
                            checked={turboMode}
                            onCheckedChange={setTurboMode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="animation-speed">Animation Speed</Label>
                          <Slider
                            id="animation-speed"
                            min={0.5}
                            max={2}
                            step={0.1}
                            value={[animationSpeed]}
                            onValueChange={([value]) => setAnimationSpeed(value)}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <BonusWheel
                  isOpen={showBonusWheel}
                  onClose={() => setShowBonusWheel(false)}
                  onResult={handleBonusWheelResult}
                />
                {bonusProgress >= 80 && (
                  <div className="mt-4 text-center">
                    <Button
                      onClick={triggerBonusGame}
                      className="bg-yellow-400 text-black hover:bg-yellow-500 animate-pulse"
                    >
                      <Gift className="mr-2 h-5 w-5" />
                      Claim Bonus Spin!
                    </Button>
                  </div>
                )}
                {winAmount > 0 && (
                  <div className="mt-4 text-center">
                    <div className="text-3xl text-yellow-400 animate-bounce">
                      You won ${winAmount}!
                    </div>
                    <div className="mt-2">
                      <Sparkles className="inline-block mr-2 h-6 w-6 text-yellow-400" />
                      <span className="text-xl text-green-400">
                        {winAmount >= bet * 10 ? 'Big Win!' : winAmount >= bet * 5 ? 'Great Win!' : 'Nice Win!'}
                      </span>
                      <Sparkles className="inline-block ml-2 h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <h3 className="text-xl mb-2">Bonus Progress</h3>
                  <Progress value={bonusProgress} className="w-full" />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl mb-2">Jackpot</h3>
                  <div className="text-4xl text-yellow-400 animate-pulse">
                    ${jackpotTicker.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Side Bet */}
      <div className="mb-8">
        <SideBet onWin={(amount) => setBalance(prevBalance => prevBalance + amount)} />
      </div>

      {/* Leaderboard */}
      <LeaderBoard />

      {/* Other Games */}
      <h2 className="text-3xl font-bold text-white mb-4">More Exciting Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game, index) => (
          <Card key={index} className="bg-black/50 text-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img src={game.image} alt={game.name} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-xl font-bold text-white">{game.name}</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
