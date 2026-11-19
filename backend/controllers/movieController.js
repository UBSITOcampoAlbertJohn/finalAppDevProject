const Movie = require('../models/Movie');

// @desc    Get all movies with optional search, category, genre, status, and sorting
// @route   GET /api/movies
exports.getMovies = async (req, res, next) => {
  try {
    const { search, category, genre, status, sort } = req.query;
    const query = {};

    // Case-insensitive search across title, director, or cast
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { director: regex },
        { cast: regex },
      ];
    }

    // Filter by category (e.g., Trending, Top Rated, Now Playing, Coming Soon, Featured)
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by genre array match
    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(`^${genre.trim()}$`, 'i')] };
    }

    // Filter by status (Published or Draft)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'releaseDate') sortOption = { releaseDate: -1 };
    if (sort === 'title') sortOption = { title: 1 };

    const movies = await Movie.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new movie
// @route   POST /api/movies
exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Movie added to vault',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing movie
// @route   PUT /api/movies/:id
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted from vault',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};