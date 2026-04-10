export function genereerSom() {
    const num1 = Phaser.Math.Between(1, 100);
    const num2 = Phaser.Math.Between(1, 100);
    const juistAntwoord = num1 + num2;

    const antwoorden = [juistAntwoord];
    while (antwoorden.length < 4) {
        const fout = Phaser.Math.Between(1, 200);
        if (!antwoorden.includes(fout)) {
            antwoorden.push(fout);
        }
    }

    antwoorden.sort(() => Math.random() - 0.5);

    return { vraag: `${num1} + ${num2} = ?`, juistAntwoord, antwoorden };
}