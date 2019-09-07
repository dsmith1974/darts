class Game:78
    _score = 501

    def __init__(self):
        pass

    def round(self):
        print ('score is ', self._score)
        print('triple 18, double 6, 14')
        input('new score? ')

    def play(self):
        while self._score > 0:
            self.round()


if __name__ == "__main__":
    game = Game()
    game.play()