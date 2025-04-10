import prisma from './db';

const demoRestaurants = [
  {
    name: 'Delhi Darbar',
    location: 'Connaught Place, Delhi',
    cuisine: ['North Indian', 'Mughlai'],
    totalSeats: 50,
    seatsAvailable: 30,
  },
  {
    name: 'The Spice Route',
    location: 'The Imperial, Delhi',
    cuisine: ['North Indian', 'South Indian', 'Chinese'],
    totalSeats: 100,
    seatsAvailable: 80,
  },
  {
    name: 'Dhaba',
    location: 'Cyber Hub, Gurgaon',
    cuisine: ['North Indian', 'Punjabi'],
    totalSeats: 150,
    seatsAvailable: 120,
  },
  {
    name: 'Saffron',
    location: ' Trident, Gurgaon',
    cuisine: ['North Indian', 'Mughlai'],
    totalSeats: 80,
    seatsAvailable: 60,
  },
  {
    name: 'Indian Accent',
    location: 'The Manor, Delhi',
    cuisine: ['North Indian', 'South Indian', 'Fusion'],
    totalSeats: 60,
    seatsAvailable: 40,
  },
  {
    name: 'Bukhara',
    location: 'ITC Maurya, Delhi',
    cuisine: ['North Indian', 'Mughlai'],
    totalSeats: 120,
    seatsAvailable: 100,
  },
];

const demoSetter = async () => {
  await prisma.restaurant.createMany({
    data: demoRestaurants,
  });
};
demoSetter();
export default demoSetter;
