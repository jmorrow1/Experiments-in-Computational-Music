--sample behavior: meshuggify [1, 0, 0] 8 -> [1, 0, 0, 1, 0, 0, 1, 0]
meshuggify :: [a] -> Int -> [a]
meshuggify phrase cycleDuration = take cycleDuration (cycle phrase)

--sample behavior: loopPhrase [0, 1] 3 -> [0, 1, 3, 4, 6, 7, 9, 10 ...]
loopPhrase :: (Enum a, Num a) => [a] -> a -> [a]
loopPhrase pts phraseDuration = 
	zipWith (+) (cycle pts) xs
	where xs = concatMap (replicate numpts) [0, phraseDuration..]
	      numpts = (length pts)

--sample behavior: meshuggify2 [0, 1] 3 16 -> [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15]
meshuggify2 :: (Enum a, Num a, Ord a) => [a] -> a -> a -> [a]
meshuggify2 pts phraseDuration cycleDuration =
	takeWhile (\x -> x < cycleDuration) loop
	where loop = loopPhrase pts phraseDuration