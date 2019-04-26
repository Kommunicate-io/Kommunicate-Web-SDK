export const UserDropDownStyles = {
    control: (styles) => (
        {
            ...styles,
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            width: 150,
            '&:hover': {
                cursor: 'pointer'
              }
        }),
};

export const UserDropDownStyleOnAgentRouting = {
    control: (styles) => (
        {
            ...styles,
            border: 'none',
            boxShadow: 'none',
            width: 150,
            borderRadius:3,
            outline: 'none',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0px -1px 4px 0 rgba(0, 0, 0, 0.1)'
        }),
}