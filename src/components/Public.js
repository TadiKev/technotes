import React from 'react'; // Importing React library
import { Link } from 'react-router-dom'; // Importing Link component for navigation

const Public = () => {
    // Defining the content of the Public component
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">Kev M. Repairs</span></h1>
            </header>
            <main className="public__main">
                <p>
                    Located in beautiful town Zimre Park Ruwa, Kev Repairs provides a trained staff ready to meet your tech repair needs.
                </p>
                <address className="public__addr">
                    Kev M. Repairs <br />
                    555 Ruwa Zimre <br />
                    Foo City, CA 12345 <br />
                    <a href="tel:+222222222">(555) 555-5555</a> {/* Changed to "tel:" for proper phone link */}
                </address>
                <br />
            </main>
            <footer>
                <Link to="/login">Employee login</Link> {/* Link to the login page */}
            </footer>
        </section>
    );

    return content; // Returning the content of the component
}

export default Public; // Exporting the Public component for use in other parts of the application
