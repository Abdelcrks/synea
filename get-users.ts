// ajoute dans main() :
const profiles = await sql`SELECT user_id, role, is_visible FROM profiles WHERE user_id IN ('XgXpWN7OhMEZI5niImvQbSIZqqHy8RTy', '6E6kTNq9ylPJaQCuGKzODXuSvefWDPVp')`;
console.log(profiles);
