--sample behavior: lerp 1 2 0.75 -> 1.75
lerp :: (Num a) => a -> a -> a -> a
lerp x y amt = x*(1-amt) + y*amt

--sample behavior: listLerp [0, 100, 200] [100, 200, 300] 0.25 -> [25, 125, 225]
listLerp :: (Num a) => [a] -> [a] -> a -> [a]
listLerp xs ys amt = zipWith (\x y -> lerp x y amt) xs ys