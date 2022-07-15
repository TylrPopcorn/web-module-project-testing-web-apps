import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />)
});

test('renders the contact form header', () => {
    render(<ContactForm />)

    const header = screen.queryByText(/contact form/i)
    /*  My failed attempt:
    const header = screen.getByLabelText(/Contact Form:/i)
    console.log(header)
 */

    //expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i)

});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)

    const inputForm = screen.getByLabelText(/First Name*/i)

    userEvent.type(inputForm, "123")

    const errorMessage = await screen.findAllByTestId('error')
    expect(errorMessage).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton)

    //wait for changes
    await waitFor(() => {
        const errorMessage = screen.queryAllByTestId("error")
        expect(errorMessage).toHaveLength(3);

    })

    /* my failed trash attempt
    const inputForm1 = screen.getByLabelText(/First Name/i)
    userEvent.type(inputForm1, " ")
    
    const inputForm3 = screen.getByLabelText(/Email/i)
    userEvent.type(inputForm3, " ")
    
    const errorMessage = await screen.findAllByTestId('error')
    expect(errorMessage).toHaveLength(3);
    */

});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)

    const firstNameField = screen.getByLabelText(/First Name/i)
    const lastName = screen.getByLabelText(/Last Name/i)

    userEvent.type(firstNameField, "12345")
    userEvent.type(lastName, "lastnametest")

    const submitBtn = screen.getByRole("button")
    userEvent.click(submitBtn)

    const errorMessage = await screen.getAllByTestId("error")
    console.log(errorMessage)
    expect(errorMessage).toHaveLength(1)

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)

    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, "test@yahoo")

    const errorMessage = await screen.findByText(/email must be a valid email address/)
    expect(errorMessage).toBeInTheDocument()
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)

    const button = screen.getByRole("button")
    userEvent.click(button)

    const errorMsg = await screen.findByText(/lastName is a required field/i)
    expect(errorMsg).toBeInTheDocument();

});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)

    const firstNameField = screen.getByLabelText(/first name*/i)
    const lastNameField = screen.getByLabelText(/last name*/i)
    const emailField = screen.getByLabelText(/first name*/i)

    userEvent.type(firstNameField, "tyler")
    userEvent.type(lastNameField, "password")
    userEvent.type(emailField, "test@yahoo")

    const button = screen.getByRole("button")
    userEvent.click(button)

    await waitFor(() => {
        const firstnameDisplay = screen.queryByText(/tyler/i)
        const lastnameDisplay = screen.queryByText(/password/i)
        const email = screen.queryByText(/test@yahoo/i)
        const msgDisplay = screen.queryByTestId(/messageDisplay/i)

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(msgDisplay).toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)


    const firstNameField = screen.getByLabelText(/first name*/i)
    const lastNameField = screen.getByLabelText(/last name*/i)
    const emailField = screen.getByLabelText(/first name*/i)
    const msg = screen.getByLabelText(/message/i)

    userEvent.type(firstNameField, "tyler")
    userEvent.type(lastNameField, "password")
    userEvent.type(emailField, "test@yahoo")
    userEvent.type(msg, "ssssss");

    const button = await screen.getByRole("button")
    userEvent.click(button)

    await waitFor(() => {
        const firstnameDisplay = screen.queryByText(/tyler/i)
        const lastnameDisplay = screen.queryByText(/password/i)
        const email = screen.queryByText(/test@yahoo/i)
        const msgDisplay = screen.queryByText(/ssssss/i)

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(msgDisplay).toBeInTheDocument();
    })
});

