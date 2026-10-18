import { getTemplateImplementation, templateRegistry } from './registry';

describe('Template Registry', () => {
  it('should return the correct template implementation for a valid ID', () => {
    const template = getTemplateImplementation('classic-elegance');
    expect(template).toBeDefined();
    expect(template?.metadata.id).toBe('classic-elegance');
    expect(template?.component).toBeDefined();
  });

  it('should return null safely for an unknown template ID', () => {
    // Spy on console.warn to keep test output clean
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    const template = getTemplateImplementation('non-existent-template-id');
    expect(template).toBeNull();
    
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('missing in the registry'));
    spy.mockRestore();
  });

  it('should accurately list supported features for a template', () => {
    const template = getTemplateImplementation('modern-minimalist');
    expect(template?.metadata.supportedFeatures).toContain('HERO');
    expect(template?.metadata.supportedFeatures).toContain('MUSIC');
    // Ensure it doesn't accidentally claim unsupported features
    expect(template?.metadata.supportedFeatures).not.toContain('MAPS'); 
  });
  
  it('ensures all registered templates have matching metadata IDs', () => {
    Object.keys(templateRegistry).forEach(key => {
      const tpl = templateRegistry[key];
      expect(tpl.metadata.id).toBe(key);
    });
  });
});
