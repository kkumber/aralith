// describe('Extract text from files', () => {
//     beforeEach(() => {
//         global.fetch = vi.fn(() =>
//             Promise.resolve({
//                 ok: true,
//                 status: 200,
//                 json: () => Promise.resolve({ data: 'mocked data' }),
//             } as Response),
//         );
//         setMockPageProps({ error: {} });
//     });

//     afterEach(() => {
//         vi.resetAllMocks();
//     });

//     it('extract text when files are submitted', async () => {
//         const user = userEvent.setup();

//         setMockPageProps({ data: { content: 'content' } });

//         render(<Main />);
//         const submitFilesForExtractionBtn = screen.getByRole('button', { name: 'Extract Lessons' });

//         await user.click(submitFilesForExtractionBtn);
//         expect(await findByText(/content/i)).toBeInTheDocument();
//         screen.debug();
//     });
// });
