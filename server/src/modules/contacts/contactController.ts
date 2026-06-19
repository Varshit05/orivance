import { Request, Response } from 'express';
import { Contact } from './contactModel.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';

// Get all contact form submissions (for admins)
export const getContacts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = {};

    if (status && ['unread', 'read', 'replied', 'archived'].includes(String(status))) {
      filter.status = String(status);
    }

    // Sort by createdAt (newest first)
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving contact messages', error: error.message });
  }
};

// Create a new contact form submission (public)
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, company, message } = req.body;

    if (!name || !email || !company || !message) {
      return res.status(400).json({ message: 'All fields (Name, Email, Company, Message) are required.' });
    }

    const newContact = new Contact({
      name,
      email,
      company,
      message,
      status: 'unread',
    });

    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error: any) {
    res.status(400).json({ message: 'Error submitting contact message', error: error.message });
  }
};

// Update contact submission status
export const updateContactStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['unread', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status type.' });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.status(200).json(updatedContact);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating contact status', error: error.message });
  }
};

// Delete a contact submission
export const deleteContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.status(200).json({ message: 'Contact message deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting contact message', error: error.message });
  }
};
