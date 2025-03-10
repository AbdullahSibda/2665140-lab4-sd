document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit-button").addEventListener("click", () => {
        const countryName = document.getElementById("country-input").value.trim();

        if (!countryName) {
            alert("Please enter a country name.");
            return;
        }

        const countryInfo = document.getElementById("country-info");
        const borderingCountries = document.getElementById("bordering-countries");
        countryInfo.innerHTML = "";
        borderingCountries.innerHTML = "<h2>Bordering Countries</h2>";

        fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Country not found");
                }
                return response.json();
            })
            .then(data => {
                const country = data[0];
                countryInfo.innerHTML = `
                    <h2>${country.name.common}</h2>
                    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
                    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                `;

                if (country.borders && country.borders.length > 0) {
                    const borderPromises = country.borders.map(border =>
                        fetch(`https://restcountries.com/v3.1/alpha/${border}`).then(res => res.json())
                    );

                    Promise.all(borderPromises)
                        .then(borderDataArray => {
                            borderDataArray.forEach(borderData => {
                                const borderCountry = borderData[0];
                                const figure = document.createElement("figure");
                                figure.innerHTML = `
                                    <img src="${borderCountry.flags.png}" alt="Flag of ${borderCountry.name.common}" width="100">
                                    <figcaption><strong>${borderCountry.name.common}</strong></figcaption>
                                `;
                                borderingCountries.appendChild(figure);
                            });
                        });
                } else {
                    borderingCountries.innerHTML += "<p>No bordering countries.</p>";
                }
            })
            .catch(error => {
                countryInfo.innerHTML = `<p style="color: black;">${error.message}</p>`;
                borderingCountries.innerHTML = "";
            });
    });
});
