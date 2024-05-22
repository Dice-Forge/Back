import pool from '../../config/pg.config.js';
import GameDataMapper from '../datamappers/game.datamapper.js';
import LicenseDataMapper from '../datamappers/license.datamapper.js';

const gameDataMapper = new GameDataMapper(pool);
const licenseDataMapper = new LicenseDataMapper(pool);

export const getGame = async (req, res) => {
    /**
 * Handles game retrieval by ID.
 *
 * @description
 * This function handles the localization of a game by its id.
 * It extracts the game id from the request parameters, then attempts to find the game in the database
 * based on the provided id. If the game does not exist, it sends a 404 Not Found response with an appropriate error message.
 * If the game is found, it sends a 200 OK response with the game data.
 * In case of any unexpected errors, it sends a 500 Internal Server Error response.
 */
    const id = req.params.id;
    const game = await gameDataMapper.findGameById(id);

    if (!game) {
        return res.status(404).json({ error: "La partie n'existe pas." });
    }

    return res.status(200).json(game);
    
}

export const createGame = async (req, res) => {
    /**
 * Handles game creation.
 *
 * @description
 * This function handles the creation of a new game.
 * It extracts the game data from the request body, then attempts to create the game in the database.
 * If the game is successfully created, it sends a 201 Created response with the game data.
 * In case of any unexpected errors, it sends a 500 Internal Server Error response.
 */
    console.log('req.session.userId', req.session.userId);
    const game = req.body;
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non connecté.' });
    }
    const license = await licenseDataMapper.findLicenseByName(game.license);
    const createdGame = await gameDataMapper.createGame(game, userId);
    console.log('createdGame', createdGame);
    res.status(201).json(createdGame, license);
}

export const updateGame = async (req, res) => {
    /**
     * Handles game update.
     *  @description
     * This function handles the update of an existing game.
     * It extracts the game id from the request parameters and the updated game data from the request body.
     * Then it attempts to update the game in the database based on the provided id.
     * If the game is successfully updated, it sends a 200 OK response with the updated game data.
     * If the game is not found, it sends a 404 Not Found response with an appropriate error message.
     * In case of any unexpected errors, it sends a 500 Internal Server Error response.
     */
    const game = {
        id: req.params.id,
        name: req.body.name,
        music: req.body.music,
        note: req.body.note,
        event: req.body.event
    };

    const updatedGame = await gameDataMapper.updateGame(game);
    if (!updatedGame) {
        return res.status(404).json({ message: "la partie n'a pas été trouvé" });
    }
    res.status(200).json(updatedGame);
};

export const deleteGame = async (req, res) => {
    /**
 * Handles game deletion.
 *
 * @description
 * This function handles the deletion of an existing game.
 * It extracts the game id from the request parameters, then attempts to delete the game in the database.
 * If the game is successfully deleted, it sends a 204 No Content response.
 * In case of any unexpected errors, it sends a 500 Internal Server Error response.
 */
    const id = req.params.id;
    await gameDataMapper.deleteGame(id);

    res.status(204).send();
}