get1 :: [a] -> Int -> a
get1 xs index = 
	xs !! (index `mod` (length xs))

get2 :: [a] -> Int -> a
get2 xs index =
	ys !! (index `mod` (length ys))
	where ys = xs ++ (reverse (guts xs))

guts :: [a] -> [a]
guts [] = []
guts (x:[]) = []
guts xs = tail $ init xs

walk :: [a] -> ([a] -> Int -> a) -> [Int] -> [a]
walk xs get stepSeq =
	map (get xs) (scanl (+) 0 (cycle stepSeq))