# Road Rush

![Game Screenshot](https://raw.githubusercontent.com/colesam/road_rush/master/images/preview.png)

This is a game I made using the Phaser 3 framework. Its mechanics and assets
are from William Clarkson's Udemy course (https://www.udemy.com/course/making-html5-games-with-phaser-3),
but the logic was completely changed to expirment with using an
Entity-Component-System architecture.

## ECS Architecture

Using an ECS architecture was overkill for a game of this size, and likely
provided no benefit other than the opportunity to learn.

The ECS system was coded completely from scratch. It is likely missing many
optimizations which I hope to make as I continue using the system in future
games.

All ECS logic can be found in the `src/ecs` directory.

### Separating systems from the framework

It was important to me that systems should be framework-agnostic whenever
possible. Certain systems had to be dependent on Phaser and have been stored
in the `src/ecs/system/client` directory.

If the game were to be made multiplayer, systems outside of the client directory
were designed to be able to run without Phaser, and therefore could be run on
a server between two clients.

Further changes would still be required for a multiplayer setup, but the way
the systems are currently laid out should be a good start.
