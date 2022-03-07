import styled from 'styled-components'

export const Wrapper = styled.div`
    pointer-events: ${props => props.move > 150 || props.move < -150 ? 'none' : 'all'};
`