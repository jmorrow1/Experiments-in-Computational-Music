module RationalRhythm
( Rhythmic (..)
, PCellState
, CellState
) where

import Data.Monoid as Monoid
import Data.Ratio as Ratio
import Data.List as List

{-------------------------
 ---Rhythmic Type class---
 -------------------------}

class (Monoid a) => Rhythmic a where
	numNotes :: a -> Int
	duration :: a -> Rational

{--------------------------------------------
 ---Type Classes for Doing Data Conversion---
 --------------------------------------------}

class ToPRhythm r where
	toPRhythm :: r -> PRhythm

class ToPCellRhythm r where
	toPCellRhythm :: r -> PCellRhythm

class ToRhythm r where
	toRhythm :: r -> Rhythm

class ToCellRhythm r where
	toCellRhythm :: r -> CellRhythm

{-------------------------------
 ---Percussive Linear Rhythms---
 -------------------------------}

data PRhythm = PRhythm { pts :: [Rational]
                       , pEndpt :: Rational } deriving (Show)

instance Monoid PRhythm where
	mempty = PRhythm {pts = [], pEndpt = 0}
	mappend PRhythm {pts = pts1, pEndpt = end1} PRhythm {pts = pts2, pEndpt = end2} =
		PRhythm {pts = pts1 ++ map (+end1) pts2, pEndpt = end1 + end2}

instance Rhythmic PRhythm where
	numNotes PRhythm {pts = a} = length a
	duration = pEndpt

instance ToRhythm PRhythm where
	toRhythm PRhythm {pts = _pts, pEndpt = _pEndpt} = Rhythm {lineSegs = map (\x -> (x, x)) _pts, endpt = _pEndpt}

instance ToPCellRhythm PRhythm where
	toPCellRhythm PRhythm {pts = p, pEndpt = end} = mconcat pcellrhythms
		where pcellrhythms = map (\x -> PCellRhythm {pcells = [PNote], pcellDuration = x}) noteDurs
		      noteDurs = foldr (\x acc -> x : (head acc - x) : tail acc) [end] (tail p)

{-----------------------------------
 ---Non-Percussive Linear Rhythms---
 -----------------------------------}

data Rhythm = Rhythm { lineSegs :: [(Rational, Rational)]
                     , endpt :: Rational } deriving (Show)

instance Monoid Rhythm where
	mempty = Rhythm {lineSegs = [], endpt = 0}
	mappend Rhythm {lineSegs = segs1, endpt = end1} Rhythm {lineSegs = segs2, endpt = end2} =
		Rhythm {lineSegs = segs1 ++ (map f segs2), endpt = end1 + end2}
		where f (a,b) = (a + end1, b + end1)

instance Rhythmic Rhythm where
	numNotes Rhythm {lineSegs = a} = length a
	duration = endpt

{---------------------------------
 ---Percussive Cellular Rhythms---
 ---------------------------------}

data PCellRhythm = PCellRhythm { pcells :: [PCellState] 
                               , pcellDuration :: Rational } deriving (Show)

data PCellState = PNote | PRest
    deriving (Show, Eq)

instance Monoid PCellRhythm where
	mempty = PCellRhythm {pcells = [], pcellDuration = 0}
	mappend r1@PCellRhythm {pcells = cells1, pcellDuration = dur1} r2@PCellRhythm {pcells = cells2, pcellDuration = dur2}
		| dur1 == dur2 = PCellRhythm {pcells = cells1 ++ cells2, pcellDuration = dur1}
		| cells1 == [] = r2
		| cells2 == [] = r1
		| otherwise = PCellRhythm {pcells = resizedCells1 ++ resizedCells2, pcellDuration = cellDur}
		{--Problem here: in lcm calculation--}
		where num = (numerator dur1) * (numerator dur2)
		      denom = lcm (denominator dur1) (denominator dur2)
		      cellDur = num % denom
		      resize cells oldDur newDur = let padding = replicate (floor (oldDur / newDur) - 1) PRest 
		                                   in concat (map (\x -> [x] ++ padding) cells)
		      resizedCells1 = resize cells1 dur1 cellDur
		      resizedCells2 = resize cells2 dur2 cellDur

instance Rhythmic PCellRhythm where
	numNotes PCellRhythm {pcells = a} = length a
	duration PCellRhythm {pcells = a, pcellDuration = b} = b * fromIntegral (length a)

instance ToCellRhythm PCellRhythm where
	toCellRhythm PCellRhythm {pcells = cs, pcellDuration = dur} = CellRhythm {cells = map toCell cs, cellDuration = dur}
		where toCell PNote = NoteStart
		      toCell PRest = Rest

a = PCellRhythm {pcells = [PNote, PRest], pcellDuration = 1.5}
b = PCellRhythm {pcells = [PNote, PRest], pcellDuration = 1}

--instance ToPRhythm PCellRhythm where
--	toPRhythm {pcells = cells, pcellDuration = dur} = {pts = , pEndpt = }

{-------------------------------------
 ---Non-Percussive Cellular Rhythms---
 -------------------------------------}

data CellRhythm = CellRhythm { cells :: [CellState]
                             , cellDuration :: Rational } deriving (Show)

data CellState = NoteStart | NoteSustain | Rest 
    deriving (Show, Eq)

instance Monoid CellRhythm where
	mempty = CellRhythm {cells = [], cellDuration = 0}
	mappend r1@CellRhythm {cells = cells1, cellDuration = dur1} r2@CellRhythm {cells = cells2, cellDuration = dur2}
		| dur1 == dur2 = CellRhythm {cells = cells1 ++ cells2, cellDuration = dur1}
		| cells1 == [] = r2
		| cells2 == [] = r1
		| otherwise = CellRhythm {cells = resizedCells1 ++ resizedCells2, cellDuration = num % denom}
		where num = (numerator dur1) * (numerator dur2)
		      denom = lcm (denominator dur1) (denominator dur2)
		      resize cells oldDur newDur = let paddingLength = floor (oldDur / newDur) - 1
		                                       pad = map (\x -> [x] ++ if (x == Rest) then replicate paddingLength Rest
		                                   	                                          else replicate paddingLength NoteSustain)
		                                   in concat $ pad cells
		      resizedCells1 = resize cells1 dur1 (num % denom)
		      resizedCells2 = resize cells2 dur2 (num % denom)

instance Rhythmic CellRhythm where
	numNotes CellRhythm {cells = c} = length c
	duration CellRhythm {cells = c, cellDuration = dur} = dur * fromIntegral (length c)